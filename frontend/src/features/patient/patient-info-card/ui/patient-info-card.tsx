import { Card, CardContent } from "@/shared/ui/card.tsx";
import { Typography } from "@/shared/ui/typography.tsx";
import { Button } from "@/shared/ui/button.tsx";
import { usePatientStore } from "@/entities/patient";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "@/app/providers/router/config/route-config.ts";
import { formattedDate } from "@/shared/config/date/format-date.ts";
import { getAge } from "@/shared/config/date/get-age.ts";
import { NotebookText } from "lucide-react";
import { useCommonStore } from "@/entities/common";

export const PatientInfoCard = () => {
  const { openModal } = useCommonStore();
  const { selectedPatient, clearSelectedPatient, confirm } = usePatientStore();
  const navigate = useNavigate();

  const handleChange = () => {
    confirm(false);
    clearSelectedPatient();
    navigate(RouteNames.MAIN);
  };

  return (
    <Card className="bg-lightGrayishBlue rounded-px20">
      <CardContent className="flex flex-row justify-between items-center px-[20px] py-2 min-h-[82px]">
        <div className="flex gap-x-[50px]">
          <div className="flex flex-col">
            <Typography variant="p" weight="light" className="text-lightGray">
              ФИО пациента
            </Typography>
            <Typography variant="p" weight="medium">
              {selectedPatient ? selectedPatient.fullName : "Пациент не выбран"}
            </Typography>
          </div>
          <div className="flex flex-col">
            <Typography variant="p" weight="light" className="text-lightGray">
              Дата рождения
            </Typography>
            {selectedPatient && selectedPatient.birthDate ? (
              <div className="flex gap-1">
                <Typography variant="p" weight="medium">
                  {formattedDate(selectedPatient.birthDate)}
                </Typography>
                <Typography
                  variant="p"
                  weight="medium"
                  className={"text-lightGray"}
                >
                  ({getAge(selectedPatient.birthDate)})
                </Typography>
              </div>
            ) : (
              "—"
            )}
          </div>
          <Button variant="outline" onClick={openModal}>
            <NotebookText />
            <Typography variant="p" className={"text-darkBlue ml-1"}>
              Медкарта
            </Typography>
          </Button>
        </div>
        <Button variant="outline" onClick={handleChange}>
          Изменить пациента
        </Button>
      </CardContent>
    </Card>
  );
};
