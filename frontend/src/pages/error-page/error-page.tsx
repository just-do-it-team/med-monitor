import { RotateCw } from "lucide-react";
import { Button } from "@/shared/ui/button.tsx";
import { Typography } from "@/shared/ui/typography.tsx";

export const ErrorPage = () => {
  const reloadPage = () => {
    location.reload();
  };

  return (
    <div className="w-full h-screen flex gap-2 items-center justify-center flex-col bg-white">
      <Typography variant="h3">Произошла непредвиденная ошибка</Typography>
      <Typography>
        Попробуйте перезагрузить страницу через некоторое время
      </Typography>
      <Button onClick={reloadPage} className="gap-2 mt-4">
        <RotateCw />
        Перезагрузить страницу
      </Button>
    </div>
  );
};
