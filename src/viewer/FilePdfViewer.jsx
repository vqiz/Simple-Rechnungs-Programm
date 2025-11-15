import { Box, Typography } from '@mui/joy'
import React, { useEffect, useState } from 'react'

function FilePdfViewer({ data }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!data?.id) return;

      const buffer = await window.api.getFullpath("lieferantenrechnungen/" + data.id);
      const blob = new Blob([buffer], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      setUrl(blobUrl);
    };

    load();
  }, [data]);

  return (
    <Box sx={{ width: "100%", pb: 6, background: "#f7f7f7" }}>
      {url && (
        <iframe
          src={url}
          style={{ width: "100%", height: "93.6vh", border: "none" }}
        />
      )}
    </Box>
  );
}

export default FilePdfViewer
