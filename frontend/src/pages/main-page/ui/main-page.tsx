import LogoIcon from "@/app/assets/icons/common/logo-icon.tsx";
import { Typography } from "@/shared/ui/typography.tsx";
import { StartSelectModal } from "@/features/common/start-select-modal";
import { getYear } from "@/shared/config/date/get-year.ts";
import { PatientUploadCard } from "@/features/patient/patient-upload-card";

const MainPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-between bg-sidebar p-10">
      <LogoIcon width={"185"} height={"73"} />
      <div className="flex flex-col gap-4 w-full max-w-sm md:max-w-xl">
        <StartSelectModal />
        <PatientUploadCard />
      </div>
      <Typography weight="light" className="text-white">
        Фетальный монитор © {getYear()} just-do-it
      </Typography>
    </div>
  );
};

export default MainPage;
