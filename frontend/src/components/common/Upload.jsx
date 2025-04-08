import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";

export default function Upload({ name, label, register, setValue, errors, onFileSelect, watch }) {
  const [previewSource, setPreviewSource] = useState("");

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      previewFile(file);
      setValue(name, file);
      onFileSelect(file);
    }
  };

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    accept: { "image/*": [".svg", ".png", ".jpeg", ".jpg"] },
    onDrop,
  });

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setPreviewSource(reader.result);
  };

  useEffect(() => {
    register(name, { required: "This field is required" });
  }, [register, name]);

  // Reset preview when the form resets
  useEffect(() => {
    if (!watch(name)) {
      setPreviewSource("");
    }
  }, [watch(name)]);

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5">{label}</label>

      <div
        {...getRootProps()}
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
      >
        <input {...getInputProps()} />
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            <img src={previewSource} alt="Preview" className="h-full w-full rounded-md object-cover" />
            <button
              type="button"
              onClick={() => {
                setPreviewSource(""); // Reset image preview
                setValue(name, null); // Reset file in form
                onFileSelect(null); // Reset file in parent
              }}
              className="mt-3 text-richblack-400 underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center p-6">
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 text-sm text-center text-richblack-200">
              Drag and drop an image, or{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
                className="font-semibold text-yellow-50 underline"
              >
                Browse
              </button>
            </p>
            <ul className="mt-10 flex list-disc justify-between space-x-12 text-xs text-richblack-200">
              <li>Supported: SVG, PNG, JPG</li>
              <li>Recommended size: 1024x576</li>
            </ul>
          </div>
        )}
      </div>

      {errors[name] && <span className="ml-2 text-xs text-pink-200">{errors[name]?.message}</span>}
    </div>
  );
}
