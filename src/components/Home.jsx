import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const loadCanvas = () => {
    const canvasId = document.querySelector("input").value;
    navigate(`/canvas/${canvasId}`);
  };

  const newCanvas = async () => {
    const docRef = await addDoc(collection(db, "canvas"), { data: null });
    navigate(`/canvas/${docRef.id}`);
  };

  return (
    <div className="home-container">
      <h1>Welcome to 2D Canva</h1>
      <button onClick={newCanvas}>Create New Canvas</button>
      <input type="text" placeholder="Enter Canvas ID" />
      <button onClick={loadCanvas}>Load Canvas</button>
    </div>
  );
}
