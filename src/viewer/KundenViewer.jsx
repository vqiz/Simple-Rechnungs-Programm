import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { getKunde } from '../Scripts/Filehandler';
import { Avatar, Box, Button, Chip, IconButton, Input, ListItem, Table, Tooltip, Typography } from '@mui/joy';
import Headline from '../components/Headline';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ListPart from '../components/ListPart';
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined';
import SearchIcon from '@mui/icons-material/Search';
function KundenViewer() {
  const { id } = useParams();
  const [kunde, setkunde] = useState();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const fkunde = await getKunde(Number(id));
      setkunde(fkunde);
    }
    fetch();
  }, []);


  return (
    <Box>
      <Box
        sx={{
          width: '100%',
          minHeight: '55px',
          bgcolor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #ddd',
          bgcolor: "background.surface",
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ width: "50%", flexDirection: "row", display: "flex" }}>
          <Tooltip title="Zurück">
            <IconButton onClick={() => navigate("/home/2")} sx={{
              "&:hover": {
                color: "#1976d2"
              }
            }}>
              <ArrowCircleLeftOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Typography
            sx={{
              ml: '15px',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#333',
              cursor: "default",
              userSelect: "none",
              mt: 0.35,
            }}
          >
            {kunde?.name}
          </Typography>
        </Box>

      </Box>
      <Box sx={{ width: "100%", height: "calc(100vh - 55px)", display: "flex", overflowY: "auto", flexDirection: "row" }}>
        <Box
          sx={{
            height: "100%",
            width: "15%",
            borderRight: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            p: 2,
            boxSizing: "border-box",
            bgcolor: "",
          }}
        >
          <Avatar sx={{ mt: 5, mb: 2 }} size='lg' />
          <Typography sx={{ fontWeight: "5px", fontWeight: "bold" }}>{kunde?.name}</Typography>
          <Box sx={{ mt: 5, width: "100%", alignContent: "flex-start", justifyContent: "flex-start", display: "flex", flexDirection: "column" }}>
            <ListPart title={"Anschrift"}>
              <ListItem>
                <Box>
                  <Typography
                    level="body-xs"
                    startDecorator={<NavigationOutlinedIcon />}
                    sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer" }}
                  >
                    {kunde?.street} {kunde?.number}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem>
                <Box>
                  <Typography
                    level="body-xs"
                    startDecorator={<ApartmentOutlinedIcon />}
                    sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer" }}
                  >
                    {kunde?.plz}, {kunde?.ort}
                  </Typography>
                </Box>
              </ListItem>
            </ListPart>
            <ListPart title={"Kontakt"}>
              <ListItem>
                <Box>
                  <Typography
                    level="body-xs"
                    startDecorator={<LocalPhoneOutlinedIcon />}
                    sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer" }}
                  >
                    {kunde?.tel}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem>
                <Box>
                  <Typography
                    level="body-xs"
                    startDecorator={<AlternateEmailOutlinedIcon />}
                    sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer" }}
                  >
                    {kunde?.email}
                  </Typography>
                </Box>
              </ListItem>
            </ListPart>
            {

              kunde?.istfirma && (
                <ListPart title={"Ansprechpartner"}>
                  <ListItem>
                    <Box>
                      <Typography
                        level="body-xs"
                        startDecorator={<PersonPinCircleOutlinedIcon />}
                        sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer" }}
                      >
                        {kunde?.ansprechpartner}
                      </Typography>
                    </Box>
                  </ListItem>
                </ListPart>
              )
            }
            <ListPart title={"Sonstiges"}>
              <ListItem>
                <Box>
                  <Typography
                    level="body-xs"
                    startDecorator={<DateRangeOutlinedIcon />}
                    sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer" }}
                  >
                    Kunde seit {new Date(kunde?.erstellt).toLocaleDateString("de-DE")}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem>
                <Box>
                  <Typography
                    level="body-xs"
                    startDecorator={<FormatListNumberedOutlinedIcon />}
                    sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer" }}
                  >
                    Leitwegid {kunde?.leitwegid ? kunde?.leitwegid : "Nicht angegeben"}
                  </Typography>
                </Box>
              </ListItem>
            </ListPart>
          </Box>
        </Box>
        <Box sx={{ width: "85%", p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 2, mt: 7 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: "50%" }}>
              <Input
                placeholder="Rechnung suchen..."
                variant="outlined"
                sx={{ flexGrow: 1, }}
                onChange={(e) => setSearchTerm(e.target.value)}

                startDecorator={<SearchIcon />}
              />
            </Box>
          </Box>
          <Table  sx={{mt: 2, "& th:nth-of-type(1)": { width: "70%" }, "& th:nth-of-type(2)": { width: "30%" }}}>
            <thead>
              <tr>
                  <th>Rechnung</th>
                  <th >Status</th>
              </tr>
            </thead>

          </Table>
        </Box>
      </Box>
    </Box>

  )
}

export default KundenViewer
