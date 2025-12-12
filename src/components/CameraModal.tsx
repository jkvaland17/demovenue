import { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import Image from "next/image";
interface CameraModalProps {
  isOpen: boolean;
  loader: boolean;
  newEnroll: boolean;
  title: string;
  onOpenChange: (isOpen: boolean) => void;
  setLoader: (isOpen: boolean) => void;
  action: (data: any) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onOpenChange,
  action,
  loader,
  title,
  setLoader,
  newEnroll,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    const HandleCamera = async () => {
      if (isOpen) {
        OpenCamera();
      } else {
        setCapturedImage(null);
        CloseCamera();
        setLoader(false);
      }
    };
    HandleCamera();
    return () => {
      CloseCamera();
      HandleCamera();
    };
  }, [isOpen, videoRef]);
  const OpenCamera = async () => {
    try {
      setIsCameraActive(true);
      setCapturedImage(null);
      const cameraResponse = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user", // Specify front camera for iOS
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = cameraResponse;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };
  const CloseCamera = () => {
    setIsCameraActive(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setLoader(false);
  };
  const handleCapture = () => {
    setLoader(true);
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.scale(-1, 1);
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL("image/png");
        setCapturedImage(base64Image);
      }
    }
    setLoader(false);
    CloseCamera();
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody className="flex items-center justify-center">
              {isCameraActive && !capturedImage && (
                <div className="mt-2 rounded-full border-4 border-blue-500 p-2">
                  <span />
                  <video
                    ref={videoRef}
                    autoPlay
                    className="h-[200px] w-[200px] rounded-full object-cover"
                    style={{ transform: "scaleX(-1)" }}
                  />
                </div>
              )}
              <canvas ref={canvasRef} style={{ display: "none" }} />
              {capturedImage && (
                <div className="my-4 rounded-full border-4 border-blue-500 p-2">
                  <Image
                    src={capturedImage}
                    alt="Captured Preview"
                    width={100}
                    height={100}
                    className="h-[200px] w-[200px] rounded-full object-cover shadow-lg"
                  />
                </div>
              )}
            </ModalBody>
            <ModalFooter className="flex flex-col">
              <Button
                color="primary"
                onPress={
                  capturedImage ? () => action(capturedImage) : handleCapture
                }
                isLoading={loader}
                size="lg"
                className="mb-3 w-full"
              >
                {capturedImage ? `Proceed` : "Capture Image"}
              </Button>
              {capturedImage && (
                <Button
                  color="primary"
                  variant="flat"
                  onPress={OpenCamera}
                  size="lg"
                  className="mb-3 w-full"
                  startContent={
                    <span className="material-symbols-outlined">replay</span>
                  }
                >
                  Recapture Image
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CameraModal;
