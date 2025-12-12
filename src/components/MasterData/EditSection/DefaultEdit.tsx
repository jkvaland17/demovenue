import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Switch,
  Textarea,
} from "@nextui-org/react";
import React from "react";

const DefaultEdit = ({
  setData,
  Data,
  handleSubmit,
  onSubmit,
  title,
  register,
  errors,
  router,
  route,
  isLoading,
}: any) => {
  return (
    <>
      <Card className="max-w-full p-3">
        <CardHeader className="flex">
          <div className="mb-2 mt-3 flex w-full flex-col justify-between gap-x-3 text-2xl md:flex-row md:items-center">
            <p className="text-xl font-medium">Update {title}</p>
            {/* <div className="flex gap-2 items-center mt-2">
              <p className="text-sm">Status</p>
              <Switch
                size="sm"
                onValueChange={(e) => setData({ ...Data, status: e })}
                isSelected={Data?.status}
              ></Switch>
            </div> */}
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4">
              <Input
                isRequired
                {...register("name")}
                value={Data?.name}
                onChange={(e) => setData({ ...Data, name: e.target.value })}
                className={`${errors?.value && "border border-red-600"}`}
                label="Name"
                type="text"
                placeholder={`Enter ${title} Name`}
                labelPlacement="outside"
                radius="sm"
              />
              <div className="col-span-1 md:col-span-2">
                <Textarea
                  {...register("description")}
                  value={Data?.description}
                  onChange={(e) =>
                    setData({ ...Data, description: e.target.value })
                  }
                  label="Description"
                  labelPlacement="outside"
                  placeholder={`Enter your ${title} description`}
                />
              </div>
            </div>
            <div className="mt-3 flex w-full items-center justify-end gap-3">
              <Button
                variant="flat"
                type="button"
                color="danger"
                radius="sm"
                onClick={() =>
                  router.push(`/admin/master/master-data/${route}`)
                }
              >
                Cancel
              </Button>
              <Button
                type="submit"
                radius="sm"
                color="primary"
                className="float-right w-full md:w-fit"
                isLoading={isLoading}
              >
                Update {title} Data
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default DefaultEdit;
