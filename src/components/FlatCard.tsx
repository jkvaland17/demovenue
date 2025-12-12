import { Button, Card } from "@nextui-org/react";
import React from "react";

interface FlatCardProps {
  children?: React.ReactNode;
  heading?: string;
  button?: boolean;
  onClick?: () => void;
  ButtonLabel?: string;
  icon?: any;
}

const FlatCard: React.FC<FlatCardProps> = ({
  children,
  heading,
  button,
  onClick,
  icon,
  ButtonLabel,
}) => {
  return (
    <Card className="mb-6 p-4">
      <div className="flex justify-between mob:flex-col">
        {heading && <h2 className="mb-4 text-xl font-semibold">{heading}</h2>}
        {button && (
          <Button
            color="primary"
            variant="shadow"
            onPress={onClick}
            className="mb-4 px-8"
            startContent={icon}
          >
            {ButtonLabel}
          </Button>
        )}
      </div>

      {children}
    </Card>
  );
};

export default FlatCard;
