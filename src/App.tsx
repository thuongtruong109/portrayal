import { useEffect, useState } from "react";
import Stone from "./Stone";

function App() {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("sample.png");

  useEffect(() => {
    if (!image) return;

    const url = URL.createObjectURL(image);
    setImageUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  return (
    <main className="grid items-center justify-center min-h-screen w-screen py-12">
      <h1 className="font-semibold text-3xl text-center">Shine on stone</h1>
      <input
        id="upload"
        hidden
        type="file"
        onChange={(e) => {
          const files = e.target.files;
          if (!files) return;

          setImage(files.item(0));
        }}
      />
      <label
        htmlFor="upload"
        className="px-6 py-2.5 w-fit bg-black mx-auto text-white/80 font-medium text-sm mt-4 cursor-pointer rounded-full"
        style={{
          boxShadow:
            "inset 6px 6px 8px rgba(255, 255, 255, 0.4), inset 6px 2px 8px rgba(255, 255, 255, 0.6), inset -3px -2px 4px rgba(255, 255, 255, 0.6), inset -2px -6px 12px rgba(0, 0, 0, 0.6)",
        }}
      >
        Upload
      </label>
      <Stone imageUrl={imageUrl} />
    </main>
  );
}

export default App;
