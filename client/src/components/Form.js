import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewPost, updatePost } from "../actions/posts";
import { getCloudinarySignature } from "../api";

const Form = ({ currentId, setCurrentId, user }) => {
  const [postData, setPostData] = useState({
    title: "",
    message: "",
    tags: "",
    selectedFile: "",
    imageUrl: "",
    imagePublicId: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const post = useSelector((state) => currentId ? state.posts.find((p) => p._id === currentId): null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const normalizeTags = (tagsValue) => {
    if (Array.isArray(tagsValue)) {
      return tagsValue;
    }
    return tagsValue
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  };

  const canSubmit = useMemo(() => !uploading, [uploading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...postData,
      tags: normalizeTags(postData.tags),
    };
    if (currentId) {
      dispatch(updatePost(currentId, payload));
    } else {
      dispatch(createNewPost(payload));
    }
    setCurrentId(null);
    setPostData({
      title: "",
      message: "",
      tags: "",
      selectedFile: "",
      imageUrl: "",
      imagePublicId: "",
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError("");
    setUploading(true);

    try {
      const signatureResponse = await getCloudinarySignature();
      const { cloudName, apiKey, timestamp, signature } =
        signatureResponse?.data || {};

      if (!cloudName || !apiKey || !timestamp || !signature) {
        throw new Error("Cloudinary signature unavailable.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      let uploadData = null;
      let uploadText = "";
      try {
        uploadData = await uploadResponse.json();
      } catch (parseError) {
        uploadData = null;
        try {
          uploadText = await uploadResponse.text();
        } catch (textError) {
          uploadText = "";
        }
      }
      if (!uploadResponse.ok) {
        const message =
          uploadData?.error?.message ||
          uploadData?.message ||
          uploadText ||
          `Upload failed (status ${uploadResponse.status}).`;
        throw new Error(message);
      }

      setPostData((prev) => ({
        ...prev,
        imageUrl: uploadData?.secure_url || "",
        imagePublicId: uploadData?.public_id || "",
        selectedFile: "",
      }));
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to upload image. Try again.";
      setUploadError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-sm w-full bg-white shadow-lg rounded-lg p-6 mx-auto mb-6">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {currentId ? "Editing" : "Creating"} a Memory
      </h2>
      <p className="text-xs text-gray-500 text-center mb-3">
        Posting as {user?.name || user?.email || "you"}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input
          type="text"
          placeholder="Title"
          className="border rounded px-3 py-2"
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <textarea
          placeholder="Message"
          className="border rounded px-3 py-2"
          value={postData.message}
          onChange={(e) => setPostData({ ...postData, message: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="border rounded px-3 py-2"
          value={Array.isArray(postData.tags) ? postData.tags.join(", ") : postData.tags}
          onChange={(e) => setPostData({ ...postData, tags: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="border rounded px-3 py-2"
        />
        {uploading && (
          <p className="text-xs text-blue-600">Uploading image...</p>
        )}
        {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
        {postData.imageUrl && (
          <img
            src={postData.imageUrl}
            alt="Preview"
            className="w-full h-40 object-cover rounded"
          />
        )}
        <button
          type="submit"
          disabled={!canSubmit}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};


export default Form;
