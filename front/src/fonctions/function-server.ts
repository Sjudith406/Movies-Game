
/**
 * 
 * @param score 
 * @param filmsFound 
 * @param playerId 
 */
export const sendScoreToServer = async (score: number, filmsFound: string[], playerId: string)=> {
    try {
      const response = await fetch("http://localhost:3100/api/score", {
        method: "POST",
        headers:
        {"Content-Type": "application/json",},
        body: JSON.stringify({ score, filmsFound, playerId })
        
      });
      if (!response.ok) {
        throw new Error("Failed to send data to server");
      }
    } catch (error) {
      console.error("Error sending data to server:", error);
    }
  };