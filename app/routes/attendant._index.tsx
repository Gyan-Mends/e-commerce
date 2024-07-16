import { useState, useEffect } from 'react';

import { LoaderFunction, redirect } from '@remix-run/node';
import { getSession } from '~/session';
import AttendantLayout from '~/layout/attendantLayout';

const Attendant = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer); // Cleanup the timer
    }, []);

    const skeletons = Array(4).fill(0); // Create an array with 4 elements for sketons

    return (
        <AttendantLayout pageName="Dashboard">
            <div className=''>
                {/* greeting container */}
                <CustomedCard className='' title='' >
                    <div>

                    </div>
                </CustomedCard>

                <div>

                </div>
            </div>
        </AttendantLayout>
    );
};

export default Attendant;

export const loader: LoaderFunction = async ({ request }) => {
    const session = getSession(request.headers.get("Cookie"));
    const token = (await session).get("email")

    if (!token) {
        return redirect("/login")
    }

    return true
}
