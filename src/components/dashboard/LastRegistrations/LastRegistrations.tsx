import { useEffect, useState } from "react";
import { FlattenedUserData } from "@/components/dashboard/TeamComponent/TeamComponent";
import { useLanguageStore } from '@/store/useLanguageStore';

interface PartnerData {
  username: string;
  line: number;
  registrationDate: string;
  firstName?: string;
}

export default function LastRegistrations({ userId }) {
  const { language } = useLanguageStore();
  const [lastRegistrations, setLastRegistrations] = useState<PartnerData[]>([]);

  const translations = {
    title: {
      ru: "Последние регистрации",
      en: "Last Registrations",
    },
    line: {
      ru: "линия",
      en: "line",
    },
  };

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
              registrationDate: new Date(registrationDate).toLocaleDateString(language === 'ru' ? "uk-UA" : "en-US"),
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
  }, [userId, language]); // Додано language до залежностей, щоб оновлювати формат дати

  return (
    <div className="flex flex-col gap-[17px] max-w-[275px]">
      <h3 className="text-[24px] font-bold mb-[25px] uppercase">
        {translations.title[language]}
      </h3>
      {lastRegistrations.length > 0 && (
        lastRegistrations.map(({ username, line, registrationDate, firstName }, index) => (
          <div key={index} className="flex flex-wrap justify-around border py-[7px] rounded-[5px] text-[16px]">
            <div>{firstName || '-'}</div>
            <div className="font-bold">
              {translations.line[language]}: {line}
            </div>
            <div>
              {new Date(registrationDate.split('.').reverse().join('-')).toLocaleTimeString(
                language === 'ru' ? 'uk-UA' : 'en-US',
                {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'UTC'
                }
              )}
            </div>
            <div>{username}</div>
          </div>
        ))
      )}
    </div>
  );
};