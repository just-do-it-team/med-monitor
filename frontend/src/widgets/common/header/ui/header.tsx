import { Card, CardHeader } from "@/shared/ui/card.tsx";
import { useDoctorStore } from "@/entities/doctor";
import { Typography } from "@/shared/ui/typography.tsx";
import { useLocation } from "react-router-dom";
import { routeMeta } from "@/app/providers/router/config/route-config.ts";
import { getInitialsWithSurname } from "@/shared/config/common/get-initials-with-surname.ts";
import { PatientCardModal } from "@/features/common/patient-card-modal";
import { PatientInfoCard } from "@/features/patient/patient-info-card";

export const Header = () => {
  const { selectedDoctor } = useDoctorStore();
  const location = useLocation();

  const current = Object.entries(routeMeta).find(([path]) =>
    location.pathname.includes(path[1]),
  );

  const pageTitle = current ? current[1].title : "Страница";

  return (
    <>
      <div className="flex justify-between items-center">
        <Typography weight="semibold" size="xl2">
          {pageTitle}
        </Typography>
        <Card className="bg-veryLightGray">
          <CardHeader>
            <Typography variant="p">
              {selectedDoctor
                ? getInitialsWithSurname(selectedDoctor.fullName)
                : "Врач не выбран"}
            </Typography>
          </CardHeader>
        </Card>
      </div>
      <PatientInfoCard />
      <PatientCardModal />
    </>
  );
};
