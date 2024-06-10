import * as React from "react";
import dayjs from "dayjs";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { styled } from "@mui/material/styles";
import { useState, useEffect, useRef } from "react";
import "dayjs/locale/de";

const CalendarContainer = styled("div")({
  width: "100%",
  maxWidth: "800px",
  height: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
});

function getEventDays(events) {
  let eventDays = [];
  events.forEach(event => {
    let current = dayjs(event.start);
    const end = dayjs(event.end);
    while (current.isBefore(end) || current.isSame(end, 'day')) {
      eventDays.push(current.format('YYYY-MM-DD'));
      current = current.add(1, 'day');
    }
  });
  return eventDays;
}

function ServerDay(props) {
  const {
    eventDays = [],
    day,
    outsideCurrentMonth,
    ...other
  } = props;

  const isSelected = !outsideCurrentMonth && eventDays.includes(day.format('YYYY-MM-DD'));

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isSelected ? "👥" : undefined}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={{
          width: 37,
          height: 37,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.0rem",
        }}
      />
    </Badge>
  );
}

export default function DateCalendarServerRequest() {
  const requestAbortController = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState(() => {
    const storedEvents = localStorage.getItem("events");
    return storedEvents ? JSON.parse(storedEvents) : [];
  });

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    return () => requestAbortController.current?.abort();
  }, []);

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }
  };

  const eventDays = getEventDays(events);

  return (
    <CalendarContainer>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
        <DateCalendar
          loading={isLoading}
          onMonthChange={handleMonthChange}
          views={["day"]}
          sx={{
            width: "100%",
            height: "auto",
            ".MuiPickersCalendarHeader-root": {
              width: "100%",
            },
            ".MuiDayCalendar-monthContainer": {
              width: "100%",
            },
            ".MuiPickersSlideTransition-root": {
              width: "100%",
            },
            ".MuiDayCalendar-weekContainer": {
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
            },
            ".MuiDayCalendar-weekContainer > div": {
              flex: "1 1 0",
              display: "flex",
              justifyContent: "center",
            },
            ".MuiDayCalendar-header": {
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
            },
            ".MuiDayCalendar-header > div": {
              flex: "1 1 0",
              textAlign: "center",
            },
          }}
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{
            day: (props) => <ServerDay {...props} eventDays={eventDays} />,
          }}
          firstDayOfWeek={1}
        />
      </LocalizationProvider>
    </CalendarContainer>
  );
}
