import React from "react";
import { Dialog, DialogContent } from "@/shared/ui/dialog.tsx";
import { Typography } from "@/shared/ui/typography.tsx";
import { useCommonStore } from "@/entities/common";
import { formattedDate } from "@/shared/config/date/format-date.ts";
import { getAge } from "@/shared/config/date/get-age.ts";
import { usePatientStore } from "@/entities/patient";

export const PatientCardModal: React.FC = () => {
  const { isModalOpen, closeModal } = useCommonStore();
  const { selectedPatient } = usePatientStore();

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => {
        closeModal();
      }}
    >
      <DialogContent>
        <Typography size="xl2" weight="medium">
          Медкарта
        </Typography>
        <div className="flex flex-col gap-[4px]">
          <Typography size="sm" weight="light" className="text-lightGray">
            ФИО пациента
          </Typography>
          <Typography size="md">
            {selectedPatient?.fullName || "Пациент не выбран"}
          </Typography>
        </div>
        <div className="flex flex-col gap-[4px]">
          <Typography size="sm" weight="light" className="text-lightGray">
            Дата рождения
          </Typography>
          {selectedPatient && selectedPatient.birthDate ? (
            <div className="flex gap-1">
              <Typography size="md">
                {formattedDate(selectedPatient.birthDate)}
              </Typography>
              <Typography size="md" className={"text-lightGray"}>
                ({getAge(selectedPatient.birthDate)})
              </Typography>
            </div>
          ) : (
            "—"
          )}
        </div>
        <div className="flex flex-col gap-[4px]">
          <Typography size="sm" weight="light" className="text-lightGray">
            Диагноз
          </Typography>
          <Typography size="md">{selectedPatient?.diagnosis || "—"}</Typography>
        </div>
      </DialogContent>
    </Dialog>
  );
};
