import React, { useEffect } from "react";
import { Dialog, DialogClose, DialogContent } from "@/shared/ui/dialog.tsx";
import { Typography } from "@/shared/ui/typography.tsx";
import { useAnalyticsStore } from "@/entities/analytics";
import { Spinner } from "@/shared/ui/spinner.tsx";
import { useAnalysisQuery } from "@/entities/analytics/model/services/services.ts";
import { useHistoryStore } from "@/entities/history";
import { usePatientStore } from "@/entities/patient";
import { Button } from "@/shared/ui/button.tsx";
import { useQueryClient } from "@tanstack/react-query";

export const AnalyticsModal: React.FC = () => {
  const { isModalOpen, closeModal, setAnalysisText } = useAnalyticsStore();

  const { selectedHistory } = useHistoryStore();
  const { selectedPatient } = usePatientStore();

  const queryClient = useQueryClient();

  const { data, isLoading, isError, isSuccess, refetch } = useAnalysisQuery(
    selectedPatient!.id,
    selectedHistory!.id,
  );

  useEffect(() => {
    if (isModalOpen) {
      setAnalysisText(null);

      queryClient.removeQueries({
        queryKey: ["analysis", selectedPatient!.id, selectedHistory!.id],
      });

      refetch();
    }
  }, [
    isModalOpen,
    refetch,
    setAnalysisText,
    queryClient,
    selectedPatient,
    selectedHistory,
  ]);

  useEffect(() => {
    if (isSuccess) {
      setAnalysisText(data?.decision ?? null);
      closeModal();
    }
  }, [isSuccess, data, setAnalysisText, closeModal]);

  return (
    <Dialog open={isModalOpen} onOpenChange={() => {}}>
      <DialogContent
        hideClose
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center space-y-8">
          {isLoading && (
            <>
              <Spinner size="extraLarge" />
              <div className="text-center">
                <Typography size="xl2" weight="semibold">
                  Выполняется анализ
                </Typography>
                <Typography weight="light">
                  Примерное время выполнения: 1 минута
                </Typography>
              </div>
            </>
          )}

          {isError && (
            <Typography weight="light" className="text-red-500">
              Ошибка загрузки анализа
            </Typography>
          )}

          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={closeModal}
            >
              Отменить
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
