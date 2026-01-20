import React, { useEffect, useRef, useState } from "react";
import { Button, Grid, TextField, Typography, Box, Paper } from "@mui/material";
import jsPDF from "jspdf";
import QRCode from "qrcode";

const Certificate = () => {
  const BACKRND = import.meta.env.VITE_LOCAL_BACKEND_PORT;
  const FRONTEND = import.meta.env.VITE_LOCAL_FRONTEND_PORT;

  const canvasRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    position: "",
    startDate: "",
    endDate: "",
    currentDate: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(" ");
    let line = "";
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      if (ctx.measureText(testLine).width > maxWidth && i > 0) {
        ctx.fillText(line, x, y);
        line = words[i] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
    return y;
  };

  const drawCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = 1000;
    canvas.height = 1414;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1e88e5";

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(220, 0);
    ctx.lineTo(0, 180);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(1000, 0);
    ctx.lineTo(780, 0);
    ctx.lineTo(1000, 180);
    ctx.fill();

    /* ================= HEADER ================= */
    ctx.textAlign = "center";
    ctx.fillStyle = "#0d47a1";
    ctx.font = "bold 38px Arial";
    ctx.fillText("Sahajanand Digital", 500, 110);

    ctx.font = "italic 16px Arial";
    ctx.fillStyle = "#555";
    ctx.fillText("you think, we did", 500, 140);

    ctx.strokeStyle = "#1e88e5";
    ctx.beginPath();
    ctx.moveTo(120, 180);
    ctx.lineTo(880, 180);
    ctx.stroke();

    /* ================= ISSUE DATE ================= */
    ctx.textAlign = "right";
    ctx.font = "15px Arial";
    ctx.fillStyle = "#333";
    ctx.fillText("From August 20, 2025", 880, 240);

    /* ================= RECIPIENT ================= */
    ctx.textAlign = "left";
    ctx.font = "15px Arial";
    ctx.fillText("To:", 120, 260);

    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(formData.fullName || "________________________", 120, 290);

    /* ================= CERTIFICATE TITLE ================= */
    ctx.textAlign = "center";
    ctx.font = "bold 26px Arial";
    ctx.fillStyle = "#1a237e";
    ctx.fillText("Internship Completion Certificate", 500, 360);

    /* ================= BODY ================= */
    ctx.textAlign = "left";
    ctx.font = "16px Arial";
    ctx.fillStyle = "#333";

    let y = 420;
    const maxWidth = 760;
    const lineHeight = 30;

    y =
      wrapText(
        ctx,
        `We state on record that ${formData.fullName || "the candidate"} has successfully completed an internship in the role of ${
          formData.position || "________"
        } at Sahajanand Digital. The internship start date was From ${
          formData.startDate || "____"
        } and end date was Till ${
          formData.endDate || "____"
        } and location of this internship was the Sahajanand Digital Office in Ahmedabad city.`,
        120,
        y,
        maxWidth,
        lineHeight,
      ) + 30;

    y =
      wrapText(
        ctx,
        `During this period, they worked on various areas of Web Development. Also got overview of product development and successfully met the objectives that were set at the beginning of the project and shows a lot of promise and skill in work and we wish all the best for the future endeavours.`,
        120,
        y,
        maxWidth,
        lineHeight,
      ) + 30;

    ctx.fillText("Thank You.", 120, y + 20);

    /* ================= SIGNATURE ================= */
    ctx.font = "15px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Sincerely,", 120, 900);

    ctx.font = "italic 30px Arial";
    ctx.fillText("Dhaval Desai", 120, 945);

    ctx.font = "15px Arial";
    ctx.fillText("Dhaval Desai", 120, 970);

    ctx.fillStyle = "#1e88e5";
    ctx.fillText("Founder & CEO", 120, 995);

    /* ================= QR CODE (SINGLE, FINAL) ================= */
    const qrData = {
      name: formData.fullName,
      position: formData.position,
      startDate: formData.startDate,
      endDate: formData.endDate,
      issueDate: formData.currentDate,
      verified: true,
    };

    const qrUrl = await QRCode.toDataURL(
      `${FRONTEND}/verify?data=${encodeURIComponent(JSON.stringify(qrData))}`,
    );

    const qrImg = new Image();
    qrImg.src = qrUrl;
    await new Promise((res) => (qrImg.onload = res));

    ctx.drawImage(qrImg, 720, 860, 150, 150);
    ctx.textAlign = "center";
    ctx.font = "12px Arial";
    ctx.fillStyle = "#555";
    ctx.fillText("Digitally Signed with QR", 795, 1030);
    ctx.fillText("2025SINS0458", 795, 1050);

    /* ================= FOOTER LINE ================= */
    ctx.strokeStyle = "#1e88e5";
    ctx.beginPath();
    ctx.moveTo(100, 1080);
    ctx.lineTo(900, 1080);
    ctx.stroke();

    /* ================= FOOTER INFO ================= */
    ctx.font = "13px Arial";
    ctx.fillStyle = "#0d47a1";
    ctx.fillText("📞 Phone : +91 8160535181", 220, 1120);
    ctx.fillText("🌐 Website : www.sahajananddigital.in", 500, 1120);
    ctx.fillText("✉️ Email : hello@sahajananddigital.in", 780, 1120);

    ctx.font = "12px Arial";
    ctx.fillStyle = "#333";
    ctx.fillText(
      "505, Blueberry Complex, Nr. Gurukul Circle, Nikol, Ahmedabad, Gujarat, India - 382350",
      500,
      1155,
    );

    /* ================= BOTTOM CORNER SHAPES ================= */
    ctx.fillStyle = "#1e88e5";

    ctx.beginPath();
    ctx.moveTo(0, 1414);
    ctx.lineTo(200, 1414);
    ctx.lineTo(0, 1260);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(1000, 1414);
    ctx.lineTo(800, 1414);
    ctx.lineTo(1000, 1260);
    ctx.fill();
  };
  const saveCertificateToDB = async () => {
    const res = await fetch(`${BACKRND}?action=issue-certificate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return data;
  };

  const downloadPDF = async () => {
    if (
      !formData.fullName ||
      !formData.position ||
      !formData.startDate ||
      !formData.endDate
    ) {
      alert("Please fill all certificate details");
      return;
    }

    setIsDownloading(true);

    // 🔥 SAVE TO DATABASE FIRST
    const dbResponse = await saveCertificateToDB();

    if (!dbResponse.success) {
      alert("Database insert failed");
      setIsDownloading(false);
      return;
    }

    await drawCanvas();

    const canvas = canvasRef.current;
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Certificate_${formData.fullName}.pdf`);

    setIsDownloading(false);
  };

  useEffect(() => {
    drawCanvas();
  }, [formData, isDownloading]);

  return (
    <Box p={4} sx={{ backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            {[
              "fullName",
              "position",
              "startDate",
              "endDate",
              "currentDate",
            ].map((field) => (
              <TextField
                key={field}
                fullWidth
                name={field}
                label={field.replace(/([A-Z])/g, " $1")}
                type={field.includes("Date") ? "date" : "text"}
                value={formData[field]}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            ))}

            <Button fullWidth onClick={downloadPDF} variant="contained">
              Download Certificate
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper>
            <canvas ref={canvasRef} style={{ width: "100%" }} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Certificate;
