import { redirect } from "@remix-run/node";
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
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec();

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
