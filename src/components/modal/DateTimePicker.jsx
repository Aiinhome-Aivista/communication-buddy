import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import dayjs from "dayjs";

// Custom theme to override selected date and clock colors
const datePickerTheme = createTheme({
  components: {
    MuiPickersDay: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#BCC7D2", // selected date background
            color: "#000000",           // selected date text
            "&:hover": {
              backgroundColor: "#BCC7D2",
            },
          },
        },
      },
    },
    MuiClockPointer: {
      styleOverrides: {
        root: {
          backgroundColor: "#BCC7D2", // clock pointer
        },
        thumb: {
          border: "14px solid #BCC7D2", // center circle
        },
      },
    },
    MuiClockNumber: {
      styleOverrides: {
        selected: {
          color: "#000000", // selected clock number
        },
      },
    },
  },
});

export default function CustomDateTimePicker({ date, setDate, errors, clearError }) {
  return (
    <ThemeProvider theme={datePickerTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label="DD/MM/YYYY  MM:HH"
          value={date ? dayjs(date) : null}
          onChange={(newValue) => {
            setDate(newValue ? newValue.toISOString() : "");
            if (newValue) clearError("date");
          }}
          defaultValue={dayjs()} // ensures current date/time selected first
          timeSteps={{ minutes: 1 }}
          slotProps={{
            textField: {
              fullWidth: true,
              size: "small",
              error: !!errors.date,
              sx: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  height: "48px",
                  backgroundColor: "white",
                  "& fieldset": {
                    borderColor: errors.date
                      ? "#FF4D01"
                      : date
                      ? "#DFB916"
                      : "#BCC7D2",
                  },
                  "&:hover fieldset": {
                    borderColor: errors.date
                      ? "#FF4D01"
                      : date
                      ? "#DFB916"
                      : "#BCC7D2",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: errors.date ? "#FF4D01" : "#E5B800",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.85rem",
                  color: errors.date ? "#FF4D017D" : "#BCC7D2",
                },
                "& .MuiInputBase-input": {
                  color: errors.date ? "#FF4D017D" : "#182938",
                },
              },
            },
            openPickerButton: {
              disableRipple: true,
              sx: {
                color: errors.date ? "#FF4D017D" : "#7E8489",
                transition: "color 0.2s ease",
              },
            },
          }}
          slots={{
            openPickerIcon: CalendarMonthIcon,
          }}
          onOpen={() => {
            if (!date) {
              setDate(dayjs().toISOString()); // sets current date & time when modal opens
            }
          }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
}
