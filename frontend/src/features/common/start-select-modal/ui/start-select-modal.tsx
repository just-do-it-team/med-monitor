import { useState } from "react";
import { usePatientStore } from "@/entities/patient";
import { useDoctorStore } from "@/entities/doctor";
import { Check, ChevronDown, Loader2, RotateCw } from "lucide-react";
import { Button } from "@/shared/ui/button.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command.tsx";
import { usePatientsQuery } from "@/entities/patient/model/services/services.ts";
import { useDoctorsQuery } from "@/entities/doctor/model/services/services.ts";
import { cn } from "@/shared/lib/utils.ts";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "@/app/providers/router/config/route-config.ts";
import { Card, CardContent } from "@/shared/ui/card.tsx";
import { Typography } from "@/shared/ui/typography.tsx";
import { getAge } from "@/shared/config/date/get-age.ts";

export function StartSelectModal() {
  const {
    data: doctorsData,
    isLoading: doctorsIsLoading,
    isError: doctorsIsError,
    refetch: doctorsRefetch,
  } = useDoctorsQuery();

  const {
    data: patientsData,
    isLoading: patientsIsLoading,
    isError: patientsIsError,
    refetch: patientsRefetch,
  } = usePatientsQuery();

  const { selectedPatient, setSelectedPatient, confirm } = usePatientStore();
  const { selectedDoctor, setSelectedDoctor } = useDoctorStore();

  const [doctorOpen, setDoctorOpen] = useState(false);
  const [patientOpen, setPatientOpen] = useState(false);

  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedDoctor && selectedPatient) {
      confirm(true);
      navigate(RouteNames.DASHBOARD);
    }
  };

  const canContinue = selectedDoctor && selectedPatient;

  return (
    <Card className="rounded-px20">
      <CardContent className="p-[30px]">
        <div className="space-y-[30px]">
          <div className="space-y-[12px]">
            <Typography variant="p" weight="medium">
              Лечащий врач
            </Typography>
            <Popover open={doctorOpen} onOpenChange={setDoctorOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={doctorOpen}
                  className="w-full justify-between bg-white border"
                  disabled={doctorsIsLoading || doctorsIsError}
                >
                  {doctorsIsLoading ? (
                    <Typography
                      weight="light"
                      variant="span"
                      className="flex items-center gap-2"
                    >
                      <Loader2 size={16} className="animate-spin" />
                      Загрузка...
                    </Typography>
                  ) : doctorsIsError ? (
                    <Typography
                      weight="light"
                      variant="span"
                      className="text-red-500"
                    >
                      Не удалось загрузить врачей
                    </Typography>
                  ) : selectedDoctor ? (
                    <Typography variant="span" weight="light">
                      {selectedDoctor.fullName}
                    </Typography>
                  ) : (
                    <Typography variant="span" weight="light" size="sm">
                      Выберите врача...
                    </Typography>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              {!patientsIsLoading && !patientsIsError && (
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Поиск врача..." />
                    <CommandList>
                      <CommandEmpty>Врач не найден</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {doctorsData?.map((doctor) => (
                          <CommandItem
                            key={doctor.id}
                            value={doctor.fullName}
                            onSelect={() => {
                              setSelectedDoctor(doctor);
                              setDoctorOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedDoctor?.id === doctor.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            <div className="flex flex-col">
                              <Typography
                                variant="span"
                                weight="light"
                                className="p-2 mr-4"
                              >
                                {doctor.fullName}
                              </Typography>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              )}
            </Popover>
            {/*{doctorsIsError ? (*/}
            {/*  <Button*/}
            {/*    size="sm"*/}
            {/*    variant="ghost"*/}
            {/*    className="px-2 h-auto font-light text-red-500 hover:text-red-600"*/}
            {/*    onClick={() => {*/}
            {/*      doctorsRefetch();*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <RotateCw size={16} className="mr-1" />*/}
            {/*    Повторить*/}
            {/*  </Button>*/}
            {/*) : null}*/}
          </div>

          <div className="space-y-[12px]">
            <Typography variant="p" weight="medium">
              Пациент
            </Typography>
            <Popover open={patientOpen} onOpenChange={setPatientOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={patientOpen}
                  className="w-full justify-between bg-white border"
                  disabled={patientsIsLoading || patientsIsError}
                >
                  {patientsIsLoading ? (
                    <Typography
                      weight="light"
                      variant="span"
                      className="flex items-center gap-2"
                    >
                      <Loader2 size={16} className="animate-spin" />
                      Загрузка...
                    </Typography>
                  ) : doctorsIsError ? (
                    <Typography
                      weight="light"
                      variant="span"
                      className="text-red-500"
                    >
                      Не удалось загрузить пациентов
                    </Typography>
                  ) : selectedPatient ? (
                    <Typography variant="span" weight="light">
                      {selectedPatient.fullName}
                    </Typography>
                  ) : (
                    <Typography variant="span" weight="light" size="sm">
                      Выберите пациента...
                    </Typography>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              {!patientsIsLoading && !patientsIsError && (
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Поиск пациента..." />
                    <CommandList>
                      <CommandEmpty>Пациент не найден</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {patientsData?.map((patient) => (
                          <CommandItem
                            key={patient.id}
                            value={`${patient.fullName} ${patient.type}`}
                            onSelect={() => {
                              setSelectedPatient(patient);
                              setPatientOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedPatient?.id === patient.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            <div className="flex flex-col">
                              <Typography
                                variant="span"
                                weight="light"
                                className="p-2"
                              >
                                {patient.fullName}
                              </Typography>
                              <Typography
                                variant="span"
                                weight="light"
                                size="sm"
                                className="px-2"
                              >
                                Тип: {patient.type} • Возраст:{" "}
                                {getAge(patient.birthDate)}
                              </Typography>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              )}
            </Popover>
            {patientsIsError || doctorsIsError ? (
              <Button
                size="sm"
                variant="ghost"
                className="px-2 pt-4 h-auto font-light text-red-500 hover:text-red-600"
                onClick={() => {
                  doctorsRefetch();
                  patientsRefetch();
                }}
              >
                <RotateCw size={16} className="mr-1" />
                Повторить загрузку
              </Button>
            ) : null}
          </div>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full mt-[30px]"
        >
          Продолжить
        </Button>
      </CardContent>
    </Card>
  );
}
