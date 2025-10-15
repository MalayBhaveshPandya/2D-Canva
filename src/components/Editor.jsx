import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import * as fabric from "fabric";

export default function Editor() {
  const { canvasId } = useParams();
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  const saveCanvas = async () => {
    try {
      const jsonString = JSON.stringify(fabricRef.current.toJSON());
      await setDoc(doc(db, "canvases", canvasId), { data: jsonString });
      alert("Canvas Saved!");
    } catch (e) {
      console.error("Error saving canvas:", e);
      alert("Failed to save canvas. Please try again.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!canvasRef.current) return;

      const canvas = new fabric.Canvas(canvasRef.current, {
        height: 600,
        width: 800,
        backgroundColor: "#fff",
      });
      fabricRef.current = canvas;

      const loadCanvas = async () => {
        const snap = await getDoc(doc(db, "canvases", canvasId));
        if (snap.exists() && snap.data().data) {
          const json =
            typeof snap.data().data === "string"
              ? JSON.parse(snap.data().data)
              : snap.data().data;
          // Added to fetch the saved changes immediately
          canvas.loadFromJSON(json, () => {
            canvas.renderAll();
            canvas.requestRenderAll();
          });
        }
      };

      loadCanvas();
    }, 100);

    return () => clearTimeout(timer);
  }, [canvasId]);

  const addrect = () => {
    fabricRef.current.isDrawingMode = false;
    fabricRef.current.add(
      new fabric.Rect({
        width: 100,
        height: 60,
        fill: "green",
      })
    );
  };

  const addcirc = () => {
    fabricRef.current.isDrawingMode = false;
    fabricRef.current.add(
      new fabric.Circle({
        radius: 50,
        fill: "blue",
      })
    );
  };

  const addtext = () => {
    fabricRef.current.isDrawingMode = false;
    fabricRef.current.add(
      new fabric.Textbox("Type Something here!", {
        left: 100,
        top: 100,
      })
    );
  };

  const addpen = () => {
    fabricRef.current.isDrawingMode = !fabricRef.current.isDrawingMode;
    if (fabricRef.current.isDrawingMode) {
      fabricRef.current.freeDrawingBrush = new fabric.PencilBrush(
        fabricRef.current
      );
      fabricRef.current.freeDrawingBrush.width = 5;
      fabricRef.current.freeDrawingBrush.color = "black";
    }
  };

  return (
    <div className="editor-container">
      <h1>Canvas ID: {canvasId}</h1>
      <div className="toolbar">
        <button onClick={addrect}>Add Rectangle</button>
        <button onClick={addcirc}>Add Circle</button>
        <button onClick={addtext}>Add Text</button>
        <button onClick={addpen}>Add Pen</button>
        <button onClick={saveCanvas}>Save Canvas</button>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
}
