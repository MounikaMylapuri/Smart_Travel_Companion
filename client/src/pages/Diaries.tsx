import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  FormControl,
  Select,
  MenuItem,
  styled,
  SelectChangeEvent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Styled components for consistent UI
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  textAlign: "center",
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const DiaryCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 16,
  overflow: "hidden",
  cursor: "pointer",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[10],
  },
}));

// Travel diary data
const diaries = [
  {
    id: 1,
    title: "Darjeeling - The queen of eastern Himalayas",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=500&q=60",
    region: "West Bengal",
    category: "Nature",
    description:
      "Experience the serene beauty of Darjeeling's tea gardens and mountain views.",
  },
  {
    id: 2,
    title:
      "8 Hours in Guwahati - The pictures capture the candidness of this impromptu trip",
    image:
      "https://images.unsplash.com/photo-1623776025811-fd139155a39b?auto=format&fit=crop&w=500&q=60",
    region: "Guwahati",
    category: "Spiritual",
    description: "A spiritual journey through the sacred sites of Guwahati.",
  },
  {
    id: 3,
    title: "Palace on Wheels: Tracing regal lifestyle on the rail tracks",
    image:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=500&q=60",
    region: "Rajasthan",
    category: "Heritage",
    description:
      "Experience the royal heritage of Rajasthan through its luxury train journey.",
  },
  {
    id: 4,
    title:
      "Adventure sports in and around Sri Vijaya Puram: Thrills amidst nature's beauty",
    image:
      "https://images.unsplash.com/photo-1617653202545-931490e8d7e7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1932",
    region: "Andaman and Nicobar Islands",
    category: "Adventure",
    description:
      "Explore the thrilling adventure activities in the beautiful Andaman Islands.",
  },
  {
    id: 5,
    title: "The 8 best adventure sports in and around Visakhapatnam",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=500&q=60",
    region: "Andhra Pradesh",
    category: "Adventure",
    description:
      "Discover the top adventure activities in the coastal city of Visakhapatnam.",
  },
  {
    id: 6,
    title:
      "Likabali to Mechuka - A journey through Arunachal Pradesh's hidden gems",
    image:
      "https://images.unsplash.com/photo-1672399444836-3f2d667ded8e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=627",
    region: "Arunachal Pradesh",
    category: "Nature",
    description: "Explore the untouched natural beauty of Arunachal Pradesh.",
  },
  {
    id: 7,
    title: "A spiritual travel guide to Gaya",
    image:
      "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=500&q=60",
    region: "Bihar",
    category: "Spiritual",
    description: "A comprehensive guide to the spiritual sites in Gaya.",
  },
  {
    id: 8,
    title:
      "Chandigarh's shopping extravaganza: unleashing the charms of retail therapy",
    image:
      "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=500&q=60",
    region: "Chandigarh",
    category: "Shopping",
    description:
      "Explore the best shopping destinations in the planned city of Chandigarh.",
  },
];

const Diaries: React.FC = () => {
  const navigate = useNavigate();
  const [interest, setInterest] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [filteredDiaries, setFilteredDiaries] = useState(diaries);

  // Handle interest filter change
  const handleInterestChange = (event: SelectChangeEvent<string>) => {
    setInterest(event.target.value);
  };

  // Handle region filter change
  const handleRegionChange = (event: SelectChangeEvent<string>) => {
    setRegion(event.target.value);
  };

  // Apply filters when interest or region changes
  useEffect(() => {
    let filtered = diaries;

    if (interest) {
      filtered = filtered.filter((diary) => diary.category === interest);
    }

    if (region) {
      filtered = filtered.filter((diary) => diary.region === region);
    }

    setFilteredDiaries(filtered);
  }, [interest, region]);

  // Get unique regions for filter dropdown
  const uniqueRegions = Array.from(
    new Set(diaries.map((diary) => diary.region))
  );

  // Get unique categories for filter dropdown
  const uniqueCategories = Array.from(
    new Set(diaries.map((diary) => diary.category))
  );

  return (
    <Box sx={{ backgroundColor: "#FFCC80", py: 8, minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <SectionTitle variant="h3">TRAVEL DIARIES</SectionTitle>
        <SectionSubtitle variant="subtitle1">
          — for every passion —
        </SectionSubtitle>

        {/* Filter controls */}
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
              {uniqueCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
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
              {uniqueRegions.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Diary Cards Grid */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: "center",
          }}
        >
          {filteredDiaries.map((diary) => (
            <Box
              key={diary.id}
              sx={{
                flexBasis: {
                  xs: "100%",
                  sm: "calc(50% - 16px)",
                  md: "calc(33.33% - 16px)",
                  lg: "calc(25% - 16px)",
                },
                minWidth: 0,
              }}
              onClick={() => navigate(`/diary/${diary.id}`)}
            >
              <DiaryCard>
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={diary.image}
                    alt={diary.title}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      bgcolor: "rgba(0, 0, 0, 0.6)",
                      color: "white",
                      padding: "10px",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" component="span">
                        {diary.region}
                      </Typography>
                      <Typography variant="body2" component="span">
                        |
                      </Typography>
                      <Typography variant="body2" component="span">
                        {diary.category}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {diary.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {diary.description}
                  </Typography>
                </CardContent>
              </DiaryCard>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Diaries;
