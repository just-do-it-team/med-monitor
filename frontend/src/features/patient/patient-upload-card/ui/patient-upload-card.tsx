import { Card, CardContent } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { FileUploadZone } from "@/shared/ui/file-upload-zone";
import { Progress } from "@/shared/ui/progress";
import { toast } from "sonner";
import { useState } from "react";
import {
  usePatientUploadMutation,
  usePatientUploadToSensorsMutation,
} from "@/entities/patient/model/services/services";

export const PatientUploadCard = () => {
  const [mediaFile, setMediaFile] = useState<File[]>([]);
  const patientUploadMutation = usePatientUploadMutation();
  const patientUploadToSensorsMutation = usePatientUploadToSensorsMutation();

  const handleUpload = () => {
    if (!mediaFile.length) return;

    const toastId = toast.loading("Загрузка файла...", {
      description: (
        <div className="min-w-full pt-2">
          <Progress value={0} />
        </div>
      ),
      duration: Infinity,
    });

    patientUploadMutation.mutate(
      {
        data: mediaFile[0],
        onProgress: (value) => {
          toast.message("Загрузка файла...", {
            id: toastId,
            description: (
              <div className="min-w-full pt-2">
                <Progress value={value} />
              </div>
            ),
          });
        },
      },
      {
        onSettled: () => {
          toast.dismiss(toastId);
        },
      },
    );
    patientUploadToSensorsMutation.mutate(
      {
        data: mediaFile[0],
      },
      {
        onSuccess: () => {
          setMediaFile([]);
        },
      },
    );
  };

  return (
    <Card className="rounded-px20">
      <CardContent className="p-[30px] space-y-[12px]">
        <Typography variant="p" weight="medium">
          Загрузить пациентов
        </Typography>
        <FileUploadZone
          title=""
          accept={{ "application/zip": [".zip"] }}
          onFilesChange={setMediaFile}
          maxFiles={1}
          clearFiles={!mediaFile.length}
        />
        {mediaFile.length ? (
          <Button
            loading={patientUploadMutation.isPending}
            disabled={!mediaFile.length || patientUploadMutation.isPending}
            className="w-full mt-[30px]"
            onClick={handleUpload}
          >
            Загрузить
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
};
