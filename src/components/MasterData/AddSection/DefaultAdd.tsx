import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import React from "react";

const DefaultAdd = ({
  handleSubmit,
  onSubmit,
  register,
  errors,
  slug,
  router,
  route,
  title,
  isLoadingBtn,
}: any) => {
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4">
          <Input
            isRequired
            {...register("name", { required: true })}
            isInvalid={!!errors.name}
            label="Name"
            type="text"
            placeholder={`Enter ${slug[0]} Name`}
            errorMessage={`Please Enter ${slug[0]} Name`}
            labelPlacement="outside"
            radius="sm"
            // startContent={<i className="fa-solid fa-user pr-2" />}
          />
          <Textarea
            {...register("description")}
            label="Description"
            labelPlacement="outside"
            placeholder={`Enter your ${slug[0]} description`}
            className="col-span-2"
          />
        </div>
        <div className="mt-3 w-full flex gap-3 items-center justify-end">
          <Button
            variant="flat"
            type="button"
            color="danger"
            onClick={() => router.push(route)}
          >
            Cancel
          </Button>
          <Button
            isLoading={isLoadingBtn}
            type="submit"
            radius="sm"
            color="primary"
            className="w-full md:w-fit"
          >
            {slug[0] === "advertisement" ? "Add" : `Create ${title} Data`}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DefaultAdd;
