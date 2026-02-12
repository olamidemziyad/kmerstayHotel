import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createHotel, uploadImage } from "../services/hotelService";
import { useNavigate } from "react-router-dom";

function AddHotelAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    region: "",
    rating: "",
    amenities: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  const { mutate: addHotel, isLoading } = useMutation({
    mutationFn: createHotel,
    onSuccess: () => navigate("/hotels"),
    onError: (err) => setError(err.response?.data?.error || "Erreur création"),
  });

  const { mutateAsync: upload } = useMutation({ mutationFn: uploadImage });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let image_url = "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const res = await upload(formData); // appelle la route uploadImage
        image_url = res.image_url;
      }

      addHotel({ ...form, image_url });
    } catch {
      setError("Erreur lors de l’envoi de l’image");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Ajouter un Hôtel</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "description", "address", "city", "region", "rating", "amenities"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field[0].toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        ))}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={isLoading}
        >
          {isLoading ? "Ajout en cours..." : "Ajouter l'hôtel"}
        </button>
      </form>
    </div>
  );
}

export default AddHotelAdmin;
