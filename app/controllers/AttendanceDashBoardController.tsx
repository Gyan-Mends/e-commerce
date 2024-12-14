import { redirect } from "@remix-run/node";
import moment from "moment";
import { RegistrationInterface, SalesInterface } from "~/interfaces/interface";
import Registration from "~/modal/registration";
import Sales from "~/modal/sales";
import { commitSession, getSession } from "~/session";

class AttendanceDashboardController {
    async getSales({
        request,
        page = 1,
        limit = 10,
    }: {
        request?: Request;
        page?: number;
        limit?: number;
    }) {
        try {
            const session = await getSession(request.headers.get("Cookie"));
            const token = session.get("email");
            const user = await Registration.findOne({ email: token });

            if (!user) {
                return { sales: [], counts: {} };
            }

            // Fetch recent sales
            const sales = await Sales.find({ attendant: user._id })
                .populate("attendant")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec();



            // Define date ranges
            const today = moment().startOf("day").toDate();
            const thisWeek = moment().startOf("week").toDate();
            const thisMonth = moment().startOf("month").toDate();
            const thisYear = moment().startOf("year").toDate();
            const oneYearAgo = moment().subtract(1, "year").startOf("day").toDate();

            // Aggregations for date ranges
            const dailySales = await Sales.aggregate([
                { $match: { createdAt: { $gte: today } } },
                { $group: { _id: null, total: { $sum: { $toDouble: "$totalAmount" } } } },
            ]);

            const weeklySales = await Sales.aggregate([
                { $match: { createdAt: { $gte: thisWeek } } },
                { $group: { _id: null, total: { $sum: { $toDouble: "$totalAmount" } } } },
            ]);

            const monthlySales = await Sales.aggregate([
                { $match: { createdAt: { $gte: thisMonth } } },
                { $group: { _id: null, total: { $sum: { $toDouble: "$totalAmount" } } } },
            ]);

            const yearlySales = await Sales.aggregate([
                { $match: { createdAt: { $gte: thisYear } } },
                { $group: { _id: null, total: { $sum: { $toDouble: "$totalAmount" } } } },
            ]);


            // Extract totals
            const dailyTotal = dailySales[0]?.total || 0;
            const weeklyTotal = weeklySales[0]?.total || 0;
            const monthlyTotal = monthlySales[0]?.total || 0;
            const yearlyTotal = yearlySales[0]?.total || 0;

            // Overall total
            const totalSalesAmount = await Sales.aggregate([
                { $group: { _id: null, total: { $sum: { $toDouble: "$totalAmount" } } } },
            ]);
            const totalAmount = totalSalesAmount[0]?.total || 0;



            // Calculate sales counts
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfWeek = new Date(startOfDay);
            startOfWeek.setDate(startOfWeek.getDate() - startOfDay.getDay());
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfYear = new Date(now.getFullYear(), 0, 1);

            const dailyCount = await Sales.countDocuments({
                attendant: user._id,
                createdAt: { $gte: startOfDay },
            });

            const weeklyCount = await Sales.countDocuments({
                attendant: user._id,
                createdAt: { $gte: startOfWeek },
            });

            const monthlyCount = await Sales.countDocuments({
                attendant: user._id,
                createdAt: { $gte: startOfMonth },
            });

            const yearlyCount = await Sales.countDocuments({
                attendant: user._id,
                createdAt: { $gte: startOfYear },
            });

            return {
                sales,
                dailyTotal,
                weeklyTotal,
                monthlyTotal,
                yearlyTotal,
                counts: {
                    daily: dailyCount,
                    weekly: weeklyCount,
                    monthly: monthlyCount,
                    yearly: yearlyCount,
                },
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async logout(intent: string) {
        if (intent === "logout") {
            const session = await getSession();

            return redirect("/", {
                headers: {
                    "Set-Cookie": await commitSession(session),
                },
            });
        }
    }
}

const attendanceDashboardController = new AttendanceDashboardController();
export default attendanceDashboardController;
