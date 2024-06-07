import React, { useState, useEffect, createContext, useContext } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Layout from "./Layout";
import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";
import CustomizedTimeline from "./TimelineComponent";

// Erstellung des Contexts für die Ereignisse
const EventsContext = createContext();

const Mitarbeiter = {
  KVD: "Kommunaler Verwaltungsdienst",
  SVD: "Staatlicher Verwaltungsdienst",
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const AdminPage = () => {
  const [open, setOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [employee, setEmployee] = useState(Object.keys(Mitarbeiter)[0]);
  const { events, setEvents } = useContext(EventsContext);

  const handleClick = () => {
    handleOpen();
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const storedEvents = localStorage.getItem(`onboardingEvents_${employee}`);
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      setEvents([]);
    }
  }, [employee, setEvents]);

  const handleAddEvent = () => {
    const newEvent = {
      name: eventName,
      date: eventDate,
      employee: employee,
    };
    const updatedEvents = [...events, newEvent].sort(
      (a, b) =>
        new Date(a.date).toLocaleString("de-DE") -
        new Date(b.date).toLocaleString("de-DE")
    );
    setEvents(updatedEvents);
    localStorage.setItem(
      `onboardingEvents_${employee}`,
      JSON.stringify(updatedEvents)
    );
    setEventName("");
    setEventDate("");
  };

  const handleAddSubEvent = () => {};

  return (
    <Layout headerText={"Ablaufplan erstellen"}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Paper>
              <Typography variant="h6">Neues Ereignis hinzufügen</Typography>
              <TextField
                label="Ereignisname"
                fullWidth
                sx={{ mb: 1 }}
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
              <TextField
                label="Datum"
                type="date"
                fullWidth
                value={eventDate}
                sx={{ mb: 1 }}
                onChange={(e) => setEventDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                select
                label="Mitarbeiter"
                fullWidth
                value={employee}
                sx={{ mb: 1 }}
                onChange={(e) => setEmployee(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                {Object.keys(Mitarbeiter).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </TextField>
              <Button
                variant="contained"
                color="primary"
                sx={{ mb: 1 }}
                onClick={handleAddEvent}
                disabled={!eventName || !eventDate}
              >
                Ereignis hinzufügen
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Paper>
              <Typography variant="h6">Ablaufplan für {employee}</Typography>
              <Timeline position="alternate">
                {events.map((event, index) => (
                  <TimelineItem key={index} onClick={handleClick}>
                    <TimelineOppositeContent
                      sx={{ m: "auto 0" }}
                      align="right"
                      variant="body2"
                      color="text.secondary"
                    >
                      {new Date(event.date).toLocaleDateString("de-DE")}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineConnector />
                      <TimelineDot />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: "12px", px: 2 }}>
                      <Typography variant="h6" component="span">
                        {event.name}
                      </Typography>
                      <Typography>{`Rolle: ${event.employee}`}</Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
              >
                <Box sx={{ ...style, width: 400 }}>
                  <Typography variant="h6">
                    Neues Ereignis hinzufügen
                  </Typography>
                  <TextField
                    label="Ereignisname"
                    fullWidth
                    sx={{ mb: 1 }}
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                  />
                  <TextField
                    label="Datum"
                    type="date"
                    fullWidth
                    value={eventDate}
                    sx={{ mb: 1 }}
                    onChange={(e) => setEventDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mb: 1 }}
                    onClick={handleAddSubEvent}
                    disabled={!eventName || !eventDate}
                  >
                    Unterereignis hinzufügen für Abschnitt
                  </Button>
                </Box>
              </Modal>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

const CreateSchedule = () => {
  const [events, setEvents] = useState([]);

  return (
    <EventsContext.Provider value={{ events, setEvents }}>
      <AdminPage />
    </EventsContext.Provider>
  );
};

export default CreateSchedule;