import dayjs from "dayjs";
import localeRu from "dayjs/locale/ru";

export function formattedDate(date?: string) {
  return dayjs(date).locale(localeRu).format("DD.MM.YYYY");
}

export function formattedDateShort(date?: string) {
  return dayjs(date).locale(localeRu).format("HH:mm:ss");
}
