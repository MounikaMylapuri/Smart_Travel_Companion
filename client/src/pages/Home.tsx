import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
// NOTE: Grid component is no longer imported
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { styled } from "@mui/material/styles";

// Sample data (unchanged)
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
      "https://images.unsplash.com/photo-1653392083932-d5e9e7d2ccd1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
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
    title:
      "Ukhimath to Madhmaheshwar: A journey through Himalayan Pradeshes hidden gems",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=500&q=60",
    category: "Adventure/Nature",
  },
  {
    id: 2,
    title:
      "8 hours in Guwahati - The spiritual significance of this Kamrupas trip",
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
    title:
      "Chandigarh's shopping experience: Exploring the charms of retail therapy",
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
      "https://images.unsplash.com/photo-1592051290693-c0f2bb382b5d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735",
    region: "South",
    interest: "Nature",
  },
  {
    id: 2,
    city: "Jalandhar",
    days: 2,
    title: "Jalandhar: cultural significance through",
    image:
      "https://plus.unsplash.com/premium_photo-1754337714793-a6c0996c24b9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
    region: "North",
    interest: "Culture",
  },
  {
    id: 3,
    city: "Ayodhya",
    days: 2,
    title: "A spiritual getaway in Ayodhya",
    image:
      "https://images.unsplash.com/photo-1623776025811-fd139155a39b?auto=format&fit=crop&w=500&q=60",
    region: "North",
    interest: "Spiritual",
  },
  {
    id: 4,
    city: "Tirupati",
    days: 2,
    title: "A land of beauty and spiritual divinity",
    image:
      "https://plus.unsplash.com/premium_photo-1697730420879-dc2a8dbaa31f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    region: "South",
    interest: "Spiritual",
  },
  {
    id: 5,
    city: "Ajmer",
    days: 2,
    title: "Ajmer serenity",
    image:
      "https://plus.unsplash.com/premium_photo-1697729683472-5e39cf4471ed?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    region: "West",
    interest: "Spiritual",
  },
];

// Styled components (unchanged)
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
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

  const handleRegionChange = (event: SelectChangeEvent) => {
    setRegion(event.target.value as string);
  };

  const handleInterestChange = (event: SelectChangeEvent) => {
    setInterest(event.target.value as string);
  };

  const handleTripLengthChange = (event: SelectChangeEvent) => {
    setTripLength(event.target.value as string);
  };

  // Utility function to calculate flexBasis for responsive layout with gap
  // The 'gap' is set to 24px (MUI spacing=3)
  const calculateFlexBasis = (columns: number, gap: number = 24) => {
    if (columns === 12) return "100%";
    const totalGap = 12 / columns - 1; // Number of gaps for the flex items in a row
    return `calc(${100 / (12 / columns)}% - ${
      totalGap * (gap / (12 / columns))
    }px)`;
  };

  return (
    <Box>
      {/* Hero Section (already uses Flexbox) */}
      <HeroSection>
        {/* ... Hero Section content ... */}
        <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Delhi
          </Typography>
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={() => navigate("/create-trip")}
            sx={{
              mt: 2,
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: "bold",
              borderRadius: "50px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
              },
            }}
          >
            Discover more
          </Button>
        </Box>
        <Box sx={{ position: "absolute", left: 20, top: "50%", zIndex: 2 }}>
          <IconButton
            sx={{
              backgroundColor: "rgba(255,255,255,0.3)",
              color: "white",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.5)",
                transform: "scale(1.1)",
              },
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        </Box>
        <Box sx={{ position: "absolute", right: 20, top: "50%", zIndex: 2 }}>
          <IconButton
            sx={{
              backgroundColor: "rgba(255,255,255,0.3)",
              color: "white",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.5)",
                transform: "scale(1.1)",
              },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </HeroSection>

      {/* --- */}

      {/* 🏞️ Attractions Section (Flexbox) */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <SectionTitle variant="h3">ATTRACTIONS</SectionTitle>
        <SectionSubtitle variant="subtitle1">
          — worth a thousand stories —
        </SectionSubtitle>

        {/* Flex container replaces Grid container */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3, // Spacing=3 (24px) for consistency with original Grid
          }}
        >
          {attractions.map((attraction) => (
            // Flex item replaces Grid item (xs=12, sm=6, md=3)
            <Box
              key={attraction.id}
              sx={{
                flexBasis: {
                  xs: "100%", // 1 column (12/12)
                  sm: `calc(50% - 12px)`, // 2 columns (6/12) - simpler calculation
                  md: `calc(25% - 18px)`, // 4 columns (3/12) - simpler calculation
                },
                minWidth: 0, // Prevents overflow issues
                display: "flex",
              }}
            >
              <Card
                sx={{
                  flexGrow: 1, // Card fills 100% height of its Flex item parent
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: 3,
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={attraction.image}
                  alt={attraction.name}
                  sx={{
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
                <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                  <Typography variant="h6">{attraction.name}</Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => navigate("/attractions")}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "50px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
              },
            }}
          >
            Discover more
          </Button>
        </Box>
      </Container>

      {/* --- */}

      {/* 📚 Travel Diaries Section (Flexbox) */}
      <Box sx={{ backgroundColor: "#FFCC80", py: 8 }}>
        <Container maxWidth="lg">
          <SectionTitle variant="h3">TRAVEL DIARIES</SectionTitle>
          <SectionSubtitle variant="subtitle1">
            — for every passion —
          </SectionSubtitle>

          {/* Filter controls already use flex */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <FormControl sx={{ minWidth: 200, mx: 1 }}>
              <Select
                value={interest}
                onChange={handleInterestChange}
                displayEmpty
                sx={{ backgroundColor: "white" }}
              >
                <MenuItem value="">
                  <em>Interests</em>
                </MenuItem>
                <MenuItem value="Nature">Nature</MenuItem>
                <MenuItem value="Culture">Culture</MenuItem>
                <MenuItem value="Spiritual">Spiritual</MenuItem>
                <MenuItem value="Shopping">Shopping</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200, mx: 1 }}>
              <Select
                value={region}
                onChange={handleRegionChange}
                displayEmpty
                sx={{ backgroundColor: "white" }}
              >
                <MenuItem value="">
                  <em>Regions</em>
                </MenuItem>
                <MenuItem value="North">North</MenuItem>
                <MenuItem value="South">South</MenuItem>
                <MenuItem value="East">East</MenuItem>
                <MenuItem value="West">West</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/diaries")}
              sx={{
                backgroundColor: "#FF9800",
                "&:hover": { backgroundColor: "#F57C00" },
              }}
            >
              View All Travel Diaries
            </Button>
          </Box>

          {/* Flex container replaces Grid container */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3, // Spacing=3 (24px)
            }}
          >
            {travelDiaries.map((diary) => (
              // Flex item replaces Grid item (xs=12, sm=6, md=3)
              <Box
                key={diary.id}
                sx={{
                  flexBasis: {
                    xs: "100%",
                    sm: `calc(50% - 12px)`,
                    md: `calc(25% - 18px)`,
                  },
                  minWidth: 0,
                  display: "flex",
                }}
              >
                <Card
                  sx={{
                    flexGrow: 1, // Card fills 100% height of its Flex item parent
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 3,
                    transition:
                      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={diary.image}
                      alt={diary.title}
                      sx={{
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
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
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => navigate("/diaries")}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: "50px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                },
              }}
            >
              Discover more
            </Button>
          </Box>
        </Container>
      </Box>

      {/* --- */}

      {/* ✈️ Trip Cards Section (Flexbox) */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            // Added wrap/unwrap for better responsiveness on small screens
            flexWrap: { xs: "wrap", md: "nowrap" },
            "& > button": {
              mt: { xs: 2, md: 0 },
              width: { xs: "100%", sm: "auto" },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1, // Added gap for spacing between controls
              "& > *": {
                mb: { xs: 1, sm: 0 }, // vertical margin on small screens for controls
              },
            }}
          >
            <FormControl sx={{ minWidth: 120, mr: { xs: 0, sm: 2 } }}>
              <Select
                value={region}
                onChange={handleRegionChange}
                displayEmpty
                size="small"
              >
                <MenuItem value="">
                  <em>Region</em>
                </MenuItem>
                <MenuItem value="North">North</MenuItem>
                <MenuItem value="South">South</MenuItem>
                <MenuItem value="East">East</MenuItem>
                <MenuItem value="West">West</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120, mr: { xs: 0, sm: 2 } }}>
              <Select
                value={interest}
                onChange={handleInterestChange}
                displayEmpty
                size="small"
              >
                <MenuItem value="">
                  <em>Interest</em>
                </MenuItem>
                <MenuItem value="Nature">Nature</MenuItem>
                <MenuItem value="Culture">Culture</MenuItem>
                <MenuItem value="Spiritual">Spiritual</MenuItem>
                <MenuItem value="Shopping">Shopping</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <Select
                value={tripLength}
                onChange={handleTripLengthChange}
                displayEmpty
                size="small"
              >
                <MenuItem value="">
                  <em>Trip Length</em>
                </MenuItem>
                <MenuItem value="1-3">1-3 Days</MenuItem>
                <MenuItem value="4-7">4-7 Days</MenuItem>
                <MenuItem value="8+">8+ Days</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button
            variant="contained"
            color="error"
            sx={{
              borderRadius: "50px",
              height: "100%",
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
              },
            }}
            onClick={() => navigate("/create-trip")}
          >
            Book Your Travel
          </Button>
        </Box>

        {/* Flex container replaces Grid container */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3, // Spacing=3 (24px)
          }}
        >
          {tripCards.map((trip) => (
            // Flex item replaces Grid item (xs=12, sm=6, md=4, lg=2)
            <Box
              key={trip.id}
              sx={{
                flexBasis: {
                  xs: "100%", // 1 column (12/12)
                  sm: `calc(50% - 12px)`, // 2 columns (6/12)
                  md: `calc(33.33% - 16px)`, // 3 columns (4/12)
                  lg: `calc(16.66% - 20px)`, // 6 columns (2/12)
                },
                minWidth: 0,
                display: "flex", // Allows Card to take 100% height
              }}
            >
              <Card
                sx={{
                  flexGrow: 1, // Card fills 100% height
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  position: "relative",
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    "& .card-image": {
                      transform: "scale(1.1)",
                    },
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={trip.image}
                  alt={trip.city}
                  className="card-image"
                  sx={{
                    height: "100%",
                    transition: "transform 0.3s ease-in-out",
                    objectFit: "cover",
                  }}
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
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
