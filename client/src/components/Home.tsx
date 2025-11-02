import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { styled } from "@mui/material/styles";
// Sample data
const attractions = [
  {
    id: 1,
    name: "Brahma Sarovar",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 2,
    name: "Hawa Mahal",
    image:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 3,
    name: "Har Ki Pauri",
    image:
      "https://images.unsplash.com/photo-1591017683260-655b616faba8?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 4,
    name: "Taj Mahal",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=500&q=60",
  },
];

const travelDiaries = [
  {
    id: 1,
    title: "Ukhimath to Madhmaheshwar",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=500&q=60",
    category: "Adventure/Nature",
  },
  {
    id: 2,
    title: "8 hours in Guwahati",
    image:
      "https://images.unsplash.com/photo-1623776025811-fd139155a39b?auto=format&fit=crop&w=500&q=60",
    category: "Spiritual",
  },
  {
    id: 3,
    title: "A spiritual travel guide to Gaya",
    image:
      "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=500&q=60",
    category: "Spiritual",
  },
  {
    id: 4,
    title: "Chandigarh's shopping experience",
    image:
      "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=500&q=60",
    category: "Shopping",
  },
];

const tripCards = [
  {
    id: 1,
    city: "Mangalore",
    days: 2,
    title: "A scenic exploration",
    image:
      "https://images.unsplash.com/photo-1590050752117-42bb3bfd9a77?auto=format&fit=crop&w=500&q=60",
    region: "South",
    interest: "Nature",
  },
  {
    id: 2,
    city: "Jalandhar",
    days: 2,
    title: "Jalandhar: cultural significance",
    image:
      "https://images.unsplash.com/photo-1588416499018-d8c621e4d1c5?auto=format&fit=crop&w=500&q=60",
    region: "North",
    interest: "Culture",
  },
  {
    id: 3,
    city: "Ayodhya",
    days: 2,
    title: "A spiritual getaway",
    image:
      "https://images.unsplash.com/photo-1623776025811-fd139155a39b?auto=format&fit=crop&w=500&q=60",
    region: "North",
    interest: "Spiritual",
  },
  {
    id: 4,
    city: "Tirupati",
    days: 2,
    title: "Land of beauty and divinity",
    image:
      "https://images.unsplash.com/photo-1621831714462-bec401ecbbfa?auto=format&fit=crop&w=500&q=60",
    region: "South",
    interest: "Spiritual",
  },
  {
    id: 5,
    city: "Ajmer",
    days: 2,
    title: "Ajmer serenity",
    image:
      "https://images.unsplash.com/photo-1591017683260-655b616faba8?auto=format&fit=crop&w=500&q=60",
    region: "West",
    interest: "Spiritual",
  },
];

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage:
    "url(https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=60)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "500px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
  fontWeight: "bold",
  fontSize: "2.5rem",
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
  color: theme.palette.text.secondary,
}));

const CategoryTag = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: "white",
  padding: "4px 8px",
  borderRadius: "4px",
  display: "inline-block",
  fontSize: "0.75rem",
  fontWeight: "bold",
}));

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [region, setRegion] = React.useState("");
  const [interest, setInterest] = React.useState("");
  const [tripLength, setTripLength] = React.useState("");

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Delhi
          </Typography>
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={() => navigate("/create-trip")}
          >
            Discover more
          </Button>
        </Box>
        <Box sx={{ position: "absolute", left: 20, top: "50%", zIndex: 2 }}>
          <IconButton
            sx={{ backgroundColor: "rgba(255,255,255,0.3)", color: "white" }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        </Box>
        <Box sx={{ position: "absolute", right: 20, top: "50%", zIndex: 2 }}>
          <IconButton
            sx={{ backgroundColor: "rgba(255,255,255,0.3)", color: "white" }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </HeroSection>

      {/* Attractions Section */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <SectionTitle variant="h3">ATTRACTIONS</SectionTitle>
        <SectionSubtitle variant="subtitle1">
          — worth a thousand stories —
        </SectionSubtitle>
        <Grid container spacing={3}>
          {attractions.map((attraction) => (
            <Grid xs={12} sm={6} md={3} key={attraction.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: 3,
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={attraction.image}
                  alt={attraction.name}
                />
                <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                  <Typography variant="h6">{attraction.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Travel Diaries Section */}
      <Box sx={{ backgroundColor: "#FFCC80", py: 8 }}>
        <Container maxWidth="lg">
          <SectionTitle variant="h3">TRAVEL DIARIES</SectionTitle>
          <SectionSubtitle variant="subtitle1">
            — for every passion —
          </SectionSubtitle>
          <Grid container spacing={3}>
            {travelDiaries.map((diary) => (
              <Grid xs={12} sm={6} md={3} key={diary.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 3,
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={diary.image}
                      alt={diary.title}
                    />
                    <Box sx={{ position: "absolute", top: 10, left: 10 }}>
                      <CategoryTag>{diary.category}</CategoryTag>
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {diary.category}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {diary.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Trip Cards Section */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Grid container spacing={3}>
          {tripCards.map((trip) => (
            <Grid xs={12} sm={6} md={3} lg={2} key={trip.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  position: "relative",
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={trip.image}
                  alt={trip.city}
                  sx={{ height: "100%" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    p: 2,
                    backgroundColor: "rgba(255,255,255,0.8)",
                  }}
                >
                  <Typography variant="body2" color="error" fontWeight="bold">
                    {trip.days} Days
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {trip.city}
                  </Typography>
                  <Typography variant="body2" noWrap>
                    {trip.title}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
