import { styled, TextField } from "@mui/material";

const CssTextField = styled(TextField)({
   "& .MuiOutlinedInput-root": {
      "& fieldset": {
         borderColor: "black",
      },
      "&.Mui-focused fieldset": {
         borderColor: "#525EC1",
      },
   },
});

export default CssTextField;
