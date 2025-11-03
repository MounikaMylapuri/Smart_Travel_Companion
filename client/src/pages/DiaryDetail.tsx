import React from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Divider,
  Button,
  // Removed: Grid, // Confirmed removal of Grid
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Sample diary data
const diaryDetails = {
  2: {
    id: 2,
    title:
      "8 hours in Guwahati - The spiritual significance of this Kamrupas trip",
    // ✅ CORRECT PATHS confirmed by folder structure
    image: "/images/guwahati.jpg",
    category: "Spiritual",
    author: "Travel Expert",
    date: "June 15, 2023",
    content: `
      <p>Guwahati, the gateway to Northeast India, is a city steeped in spiritual significance and natural beauty. Even with just 8 hours to spare, you can experience the essence of this ancient city.</p>
      
      <h3>Morning (8:00 AM - 11:00 AM)</h3>
      <p>Begin your spiritual journey at the sacred Kamakhya Temple, one of the oldest of the 51 Shakti Peethas. Perched atop Nilachal Hill, this temple is dedicated to the goddess Kamakhya and is a center for Tantric practices. The temple's architecture and spiritual ambiance make it a must-visit.</p>
      
      <h3>Mid-day (11:30 AM - 2:00 PM)</h3>
      <p>Head to the mighty Brahmaputra River for a river cruise. The panoramic views of the city and the Umananda Temple on Peacock Island, the world's smallest inhabited riverine island, are breathtaking. The island houses a temple dedicated to Lord Shiva.</p>
      
      <h3>Afternoon (2:30 PM - 4:30 PM)</h3>
      <p>Visit the Assam State Museum to understand the rich cultural heritage of the region. The museum houses a collection of sculptures, artifacts, and manuscripts that tell the story of Assam's history.</p>
      
      <h3>Evening (5:00 PM - 8:00 PM)</h3>
      <p>Conclude your day at the serene Basistha Ashram, located at the foothills of the Shillong Plateau. This ancient temple and ashram, dedicated to sage Basistha, is surrounded by lush greenery and natural springs, offering a peaceful end to your spiritual journey.</p>
    `,
    highlights: [
      "Kamakhya Temple - One of the oldest Shakti Peethas",
      "Brahmaputra River Cruise - Panoramic views of the city",
      "Umananda Temple - World's smallest inhabited riverine island",
      "Assam State Museum - Rich cultural heritage",
      "Basistha Ashram - Ancient temple surrounded by natural springs",
    ],
    images: [
      "/images/kamakhya-temple.jpg",
      "/images/brahmaputra-river.jpg",
      "/images/umananda-temple.jpg",
      "/images/assam-museum.jpg",
      "/images/basistha-ashram.jpg",
    ],
  },
};

const DiaryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const diary = diaryDetails[Number(id) as keyof typeof diaryDetails];

  if (!diary) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" align="center">
          Diary not found
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 4 }}
      >
        Back to Diaries
      </Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {diary.title}
        </Typography>

        {/* Info/Metadata Section - uses Flexbox */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            By {diary.author}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {diary.date}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              bgcolor: "error.main",
              color: "white",
              px: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            {diary.category}
          </Typography>
        </Box>

        {/* Main Image */}
        <Box
          component="img"
          src={diary.image}
          alt={diary.title}
          sx={{
            width: "100%",
            height: 400,
            objectFit: "cover",
            borderRadius: 2,
            mb: 4,
          }}
        />

        {/* Highlights Section */}
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Highlights
        </Typography>
        <Box sx={{ mb: 4 }}>
          {diary.highlights.map((highlight, index) => (
            <Typography key={index} variant="body1" sx={{ mb: 1 }}>
              • {highlight}
            </Typography>
          ))}
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Content Section */}
        <Box
          dangerouslySetInnerHTML={{ __html: diary.content }}
          sx={{
            "& p": { mb: 2 },
            "& h3": { mt: 3, mb: 2, fontWeight: "bold" },
          }}
        />

        <Divider sx={{ my: 4 }} />

        {/* --- Photo Gallery (Flexbox) --- */}
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Photo Gallery
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2, // Replaces Grid spacing={2}
          }}
        >
          {diary.images.map((image, index) => (
            // Flex item replaces Grid item (xs=12, sm=6, md=4)
            <Box
              key={index}
              sx={{
                flexBasis: {
                  xs: "100%",
                  sm: "calc(50% - 8px)", // 2 items per row
                  md: "calc(33.33% - 13.33px)", // 3 items per row
                },
                minWidth: 0,
                display: "flex",
              }}
            >
              <Card sx={{ flexGrow: 1 }}>
                <CardMedia
                  component="img"
                  height="200"
                  // Image path referencing the public folder
                  image={image}
                  alt={`Gallery image ${index + 1}`}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {diary.highlights[index]}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
        {/* --- End Photo Gallery --- */}

        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={() => navigate("/create-trip?destination=Guwahati")}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 50,
              fontWeight: "bold",
            }}
          >
            Plan Your Trip to Guwahati
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DiaryDetail;
