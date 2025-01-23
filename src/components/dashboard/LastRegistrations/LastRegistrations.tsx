import { useEffect, useState } from "react";
import { FlattenedUserData } from "@/components/dashboard/TeamComponent/TeamComponent";

interface PartnerData {
  username: string;
  line: number;
  registrationDate: string;
  firstName?: string;
}

export default function LastRegistrations({ userId }) {
  const [lastRegistrations, setLastRegistrations] = useState<PartnerData[]>([]);

  useEffect(() => {
    const fetchLastRegistrations = async () => {
      try {
        const response = await fetch(`/api/getTeam?userId=${userId}`);
        if (response.ok) {
          const data: FlattenedUserData[] = await response.json();
          const sortedData = data
            .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
            .slice(0, 4)
            .map(({ username, line, registrationDate, firstName }) => ({
              username,
              line,
              registrationDate: new Date(registrationDate).toLocaleDateString("uk-UA"),
              firstName,
            }));
          setLastRegistrations(sortedData);
        } else {
          console.error("Failed to fetch team data");
        }
      } catch (error) {
        console.error("Error fetching last registrations:", error);
      }
    };

    if (userId) fetchLastRegistrations();
  }, [userId]);

  return (
    <div className="flex flex-col gap-[17px]">
      <h3 className="text-[24px] font-bold mb-[25px]">Регистрация партнеров</h3>
      {lastRegistrations.length > 0 && (
        lastRegistrations.map(({ username, line, registrationDate, firstName}, index) => (
          <div key={index} className="flex flex-wrap justify-around border py-[7px] rounded-[5px] text-[16px]">
            <div>{firstName}</div>
            <div className="font-bold">линия: {line}</div>
            <div>{new Date(registrationDate.split('.').reverse().join('-')).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}</div>
            <div>{username}</div>
          </div>
        ))
      )}
    </div>
  );
};