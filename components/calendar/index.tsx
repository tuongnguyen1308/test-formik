import React, { FC, useEffect, useState } from "react";
import { Switch } from "@mui/material";
import { add, isEqual, sub } from "date-fns";
import {
  CalendarPicker,
  LocalizationProvider,
  PickersDay,
  PickersDayProps,
  StaticDatePicker,
} from "@mui/x-date-pickers";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import endOfWeek from "date-fns/endOfWeek";
import isSameDay from "date-fns/isSameDay";
import isWithinInterval from "date-fns/isWithinInterval";
import startOfWeek from "date-fns/startOfWeek";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

import styles from "./index.module.scss";

const DAYS_IN_WEEK = ["日", "月", "火", "水", "木", "金", "土"];

type CustomPickerDayProps = PickersDayProps<Date> & {
  dayIsBetween: boolean;
  isFirstDay: boolean;
  isLastDay: boolean;
};

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== "dayIsBetween" && prop !== "isFirstDay" && prop !== "isLastDay",
})<CustomPickerDayProps>(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
  ...(dayIsBetween && {
    borderRadius: 0,
    backgroundSize: "contain",
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.main,
    },
    backgroundColor: theme.palette.primary.main,
  }),
  ...(isFirstDay && {
    backgroundColor: "blue",
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
  }),
  ...(isLastDay && {
    backgroundColor: "blue",
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
  }),
})) as React.ComponentType<CustomPickerDayProps>;

const Calendar: FC = () => {
  const now = new Date(new Date().toDateString());
  const [selectedDate, setSelectedDate] = useState(now);
  const [firstDayOfTheWeek, setFirstDayOfTheWeek] = useState<Date>();
  const [lasttDayOfTheWeek, setLastDayOfTheWeek] = useState<Date>();
  const [week, setWeek] = useState<Date[]>();
  const [isOpenSelectDate, setIsOpenSelectDate] = useState(false);

  useEffect(() => {
    const day = selectedDate.getDay();
    const firstDayOfTheWeek = sub(selectedDate, { days: day - 1 });
    setFirstDayOfTheWeek(firstDayOfTheWeek);
  }, [selectedDate]);

  useEffect(() => {
    if (!!firstDayOfTheWeek) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(add(firstDayOfTheWeek, { days: i }));
      }
      setWeek(week);
      setLastDayOfTheWeek(add(firstDayOfTheWeek, { days: 6 }));
    }
  }, [firstDayOfTheWeek]);

  const handleChangePage = (nextPage: "prev" | "next") => {
    let newDate = selectedDate;
    switch (nextPage) {
      case "prev":
        newDate = sub(selectedDate, { days: 7 });
        break;
      case "next":
        newDate = add(selectedDate, { days: 7 });
        break;
    }
    setSelectedDate(newDate);
  };

  const renderWeekPickerDay = (
    date: Date,
    selectedDates: Array<Date | null>,
    pickersDayProps: PickersDayProps<Date>
  ) => {
    if (!selectedDate) {
      return <PickersDay {...pickersDayProps} />;
    }

    const start = startOfWeek(selectedDate);
    const end = endOfWeek(selectedDate);

    const dayIsBetween = isWithinInterval(date, { start, end });
    const isFirstDay = isSameDay(date, start);
    const isLastDay = isSameDay(date, end);

    return (
      <CustomPickersDay
        {...pickersDayProps}
        disableMargin
        dayIsBetween={dayIsBetween}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
      />
    );
  };

  return (
    <section className="">
      <header className={styles.header}>
        <Switch />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            label="Week picker"
            value={selectedDate}
            onChange={(date) => {
              date && setSelectedDate(new Date(date));
            }}
            renderDay={renderWeekPickerDay}
            renderInput={(params) => <TextField {...params} />}
            inputFormat="'Week of' MMM d"
          />
        </LocalizationProvider>
        <section className={styles.tool}>
          <button onClick={() => setSelectedDate(now)}>今日</button>
          {firstDayOfTheWeek && lasttDayOfTheWeek && (
            <div className={styles["middle"]}>
              <span>
                {firstDayOfTheWeek.getDate()}-{firstDayOfTheWeek.getMonth() + 1}
                ~{lasttDayOfTheWeek.getDate()}-
                {lasttDayOfTheWeek.getMonth() + 1}
              </span>
              <button onClick={() => setIsOpenSelectDate((prev) => !prev)}>
                <KeyboardArrowDownIcon />
              </button>
              {isOpenSelectDate && (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <CalendarPicker
                    className={styles["calendar-picker"]}
                    date={selectedDate}
                    onChange={(date) => {
                      date && setSelectedDate(new Date(date));
                      setIsOpenSelectDate(false);
                    }}
                  />
                </LocalizationProvider>
              )}
            </div>
          )}
          <div className="pagination">
            <button onClick={() => handleChangePage("prev")}>
              <ArrowBackIosNewIcon />
            </button>
            <button onClick={() => handleChangePage("next")}>
              <ArrowForwardIosIcon />
            </button>
          </div>
          {/* <DatePicker  /> */}
        </section>
      </header>
      <main>
        <div className={styles["days-label"]}>
          {week?.map((day) => (
            <div key={day.getDay()} className={styles["date"]}>
              {DAYS_IN_WEEK[day.getDay()]}
            </div>
          ))}
        </div>
        <div className={styles["dates"]}>
          {week?.map((day) => (
            <div key={day.getDay()} className={styles["date"]}>
              <span className={isEqual(day, now) ? styles["active"] : ""}>
                {day.getDate()}
              </span>
            </div>
          ))}
        </div>
      </main>
    </section>
  );
};

export default Calendar;
