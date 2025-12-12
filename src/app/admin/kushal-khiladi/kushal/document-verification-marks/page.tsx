"use client";
import {
  CallGetAllMarksCommittee,
  CallGetAllSports,
  CallGetKuhsalTeams,
  CallUpdateMarksCommittee,
  CallUpload20Marks,
} from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FilterSearchBtn from "@/components/FilterSearchBtn";
import FlatCard from "@/components/FlatCard";
import CustomMultipleUpload from "@/components/kushal-components/CustomMultipleUpload";
import ExcelPdfDownload from "@/components/kushal-components/ExcelPdfDownload";
import TableSkeleton from "@/components/kushal-components/loader/TableSkeleton";
import { DownloadKushalExcel } from "@/Utils/DownloadExcel";
import {
  Accordion,
  AccordionItem,
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const DocumentVerificationMarks = () => {
  const { currentAdvertisementID } = useAdvertisement();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [allFilters, setAllFilters] = useState<any>({
    committee: [],
    sports: [],
    subSports: [],
  });
  const [filterData, setFilterData] = useState<any>({
    sports: "",
  });
  const [upload, setUpload] = useState<any>([]);
  const [allSports, setAllSports] = useState<any[]>([]);
  const [allMarksCommittee, setAllMarksCommittee] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [loader, setLoader] = useState<any>({
    page: false,
    excel: false,
  });
  const { setValue, register } = useForm();

  const getAllMarksCommittee = async (filter: boolean) => {
    setLoader((prev: any) => ({
      ...prev,
      page: true,
    }));
    try {
      const filterOn = `advertisementId=${currentAdvertisementID}&sports=${filterData?.sports}&page=${page}&limit=10`;
      const filterOff = `advertisementId=${currentAdvertisementID}&page=${page}&limit=10`;
      const { data, error } = (await CallGetAllMarksCommittee(
        filter ? filterOn : filterOff,
      )) as any;

      console.log("getAllMarksCommittee", { data, error });
      if (data) {
        setAllMarksCommittee(data?.data);
        setTotalPage(data?.pagination?.totalPages);
      }
      if (error) {
        toast.error(error);
      }
      setLoader((prev: any) => ({
        ...prev,
        page: false,
      }));
    } catch (error) {
      console.log(error);
      setLoader((prev: any) => ({
        ...prev,
        page: false,
      }));
    }
  };
  const getAllCommittee = async () => {
    try {
      const query = `page=${page}&limit=10&groupType=committee&advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallGetKuhsalTeams(query)) as any;
      // console.log("getAllCommittee", { data, error });

      if (data) {
        setAllFilters((prevFilters: any) => ({
          ...prevFilters,
          committee: data?.data,
        }));
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (currentAdvertisementID) {
      getAllMarksCommittee(true);
      getAllCommittee();
    }
  }, [currentAdvertisementID, page]);

  const clearFilter = () => {
    setFilterData({
      sports: "",
    });
    getAllMarksCommittee(false);
  };

  const handleChangeST = (e: any) => {
    const newFiles = Array.from(e.target.files);
    setUpload((prevFiles: any[]) => [...prevFiles, ...newFiles]);
    setValue("file", (prevFiles: any[]) => [...prevFiles, ...newFiles]);
  };
  const upload20Marks = async () => {
    const formData = new FormData();
    if (upload?.length > 0) {
      upload?.forEach((item: any) => {
        formData.append("file", item);
      });
    }
    formData.append("advertisementId", currentAdvertisementID);
    try {
      const { data, error } = (await CallUpload20Marks(formData)) as any;
      console.log("upload20Marks", { data, error });

      if (data?.success === true) {
        toast.success(data?.message);
        onClose();
        setUpload([]);
      }
      if (error) {
        toast.error(error);
        onClose();
        setUpload([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllSports = async () => {
    try {
      const { data, error } = (await CallGetAllSports("")) as any;
      if (data) {
        setAllSports(data?.data);
      }
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    getAllSports();
  }, []);

  return (
    <>
      {loader?.page ? (
        <FlatCard>
          <TableSkeleton columnsCount={5} isTitle />
        </FlatCard>
      ) : (
        <>
          <FlatCard>
            <h2 className="mb-4 text-xl font-semibold">20 Marks Committee</h2>

            <div className="mb-6 grid grid-cols-4 items-end gap-4 mob:flex flex-col mob:items-start">
              <Autocomplete
                label="Sports"
                labelPlacement="outside"
                defaultItems={allSports?.filter(
                  (item: any) => !item.parentSportsId,
                )}
                placeholder="Select"
                selectedKey={filterData?.sports}
                onSelectionChange={(key) => {
                  setFilterData({
                    ...filterData,
                    sports: key,
                  });
                }}
              >
                {(item: any) => (
                  <AutocompleteItem key={item?._id}>
                    {item?.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
              <ExcelPdfDownload
                excelFunction={() => {
                  DownloadKushalExcel(
                    `v1/admin/downloadAllCommitteeMarksExcel?advertisementId=${currentAdvertisementID}&sports=${filterData?.sports}&page=${page}&limit=10`,
                    "20 Marks Committee",
                    setLoader,
                  );
                }}
                excelLoader={loader?.excel}
              />
              <FilterSearchBtn
                searchFunc={() => getAllMarksCommittee(true)}
                clearFunc={clearFilter}
              />
            </div>

            <div className="sports_table mob:w-auto mob:overflow-x-scroll">
              <table className="w-full border text-sm" border={1}>
                <thead>
                  <tr>
                    <th rowSpan={3} style={{ width: "10%" }}>
                      Chest no.
                    </th>
                    <th rowSpan={3} style={{ width: "10%" }}>
                      Full name
                    </th>
                    <th colSpan={4} style={{ width: "50%" }}>
                      Category
                    </th>
                    <th rowSpan={3} style={{ width: "10%" }}>
                      Total Marks (Out of 20)
                    </th>
                    <th rowSpan={3} style={{ width: "10%" }}>
                      Remark
                    </th>
                  </tr>
                  <tr>
                    <th style={{ width: "15%" }}>A</th>
                    <th style={{ width: "15%" }}>B</th>
                    <th style={{ width: "15%" }}>C</th>
                    <th style={{ width: "15%" }}>D</th>
                  </tr>
                  <tr>
                    <th>
                      <ol>
                        <li>Olympic Games</li>
                        <li>World Championship</li>
                        <li>World Cup</li>
                      </ol>
                    </th>
                    <th>
                      <ol>
                        <li>Asian Games</li>
                        <li>Commonwealth Games (Senior)</li>
                        <li>Commonwealth Championship(Senior)</li>
                        <li>Asian Championship(Senior)</li>
                      </ol>
                    </th>
                    <th>
                      <ol>
                        <li>Youth Olympic Games</li>
                        <li>Asian Championship (Senior) Under-21</li>
                        <li>Commonwealth Youth Games</li>
                        <li>South Asian Games</li>
                        <li>World University Games/Championship</li>
                        <li>
                          Other International Competitions affiliated with the
                          Olympic Association
                        </li>
                      </ol>
                    </th>
                    <th>
                      <ol>
                        <li>National Games</li>
                        <li>National Championship (Junior/Senior)</li>
                        <li>Federation Cup National (Junior/Senior)</li>
                        <li>All India Inter State Championship (Senior)</li>
                        <li>All India Inter University Tournament</li>
                        <li>World School Games Under-19</li>
                        <li>National School Games Under-19</li>
                        <li>All India Police Games</li>
                      </ol>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allMarksCommittee?.map((item) => (
                    <tr key={item?._id}>
                      <td>{item?.chestNo}</td>
                      <td>---</td>
                      <td>{item?.category === "A" ? item?.marks : 0}</td>
                      <td>{item?.category === "B" ? item?.marks : 0}</td>
                      <td>{item?.category === "C" ? item?.marks : 0}</td>
                      <td>{item?.category === "D" ? item?.marks : 0}</td>
                      <td>{item?.marks}</td>
                      <td>{item?.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 grid grid-cols-2 gap-12 mob:grid-cols-1 mob:gap-0">
                <Button
                  color="primary"
                  variant="solid"
                  className="mb-12 text-wrap mob:mb-3"
                  onPress={onOpen}
                >
                  <p className="text-white">
                    Upload the Committee marks With Signature (Candidate/
                    Committee Head)
                  </p>
                </Button>
                <Pagination
                  className="ms-auto mob:mb-5"
                  showControls
                  total={totalPage}
                  page={page}
                  onChange={(page) => setPage(page)}
                />
              </div>
            </div>

            <Accordion variant="bordered" defaultExpandedKeys="all">
              <AccordionItem
                key="1"
                title="Instructions for awarding Document Verification Marks"
                className="p-0"
              >
                <div className="sports_table mob:w-auto mob:overflow-x-scroll">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th style={{ width: "10%" }}>Category</th>
                        <th style={{ width: "40%" }}>Sport Championship</th>
                        <th style={{ width: "20%" }}>Participation only</th>
                        <th style={{ width: "10%" }}>Bronze Medal</th>
                        <th style={{ width: "10%" }}>Silver Medal</th>
                        <th style={{ width: "10%" }}>Gold Medal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ width: "10%", textAlign: "center" }}>A</td>
                        <td style={{ width: "40%" }}>
                          <ol>
                            <li>Olympic Games</li>
                            <li>World Championship</li>
                            <li>World Cup</li>
                          </ol>
                        </td>
                        <td
                          style={{ width: "20%", textAlign: "center" }}
                          colSpan={4}
                          rowSpan={2}
                        >
                          20
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "10%", textAlign: "center" }}>B</td>
                        <td style={{ width: "40%" }}>
                          <ol>
                            <li>Asian Games</li>
                            <li>Commonwealth Games (Senior)</li>
                            <li>Commonwealth Championship (Senior)</li>
                            <li>Asian Championship (Senior)</li>
                          </ol>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "10%", textAlign: "center" }}>C</td>
                        <td style={{ width: "40%" }}>
                          <ol>
                            <li>Youth Olympic Games</li>
                            <li>
                              Asian Championship (Junior/Senior, Under-21)
                            </li>
                            <li>Commonwealth Youth Games</li>
                            <li>South Asian Games</li>
                            <li>World University Games/Championship</li>
                            <li>
                              Other International Competitions affiliated with
                              Olympic Association
                            </li>
                          </ol>
                        </td>
                        <td style={{ width: "10%", textAlign: "center" }}>
                          18
                        </td>
                        <td
                          style={{ width: "10%", textAlign: "center" }}
                          colSpan={3}
                        >
                          19
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "10%", textAlign: "center" }}>D</td>
                        <td style={{ width: "40%" }}>
                          <ol>
                            <li>National Games</li>
                            <li>National Championship (Junior/Senior)</li>
                            <li>Federation Cup National (Junior/Senior)</li>
                            <li>All India Inter State Championship (Senior)</li>
                            <li>World School Games (Under-19)</li>
                            <li>All India Police Games</li>
                          </ol>
                        </td>
                        <td style={{ width: "20%" }}>
                          3 (Single participation) 4 (more than 1 participation)
                        </td>
                        <td style={{ width: "10%", textAlign: "center" }}>8</td>
                        <td style={{ width: "10%", textAlign: "center" }}>9</td>
                        <td style={{ width: "10%", textAlign: "center" }}>
                          10
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "10%", textAlign: "center" }}>D</td>
                        <td style={{ width: "40%" }}>
                          <ol>
                            <li>All India Inter University Tournament</li>
                            <li>National School Games (Under-19)</li>
                          </ol>
                        </td>
                        <td style={{ width: "20%" }}>
                          2 (Single participation) 3 (more than 1 participation)
                        </td>
                        <td style={{ width: "10%", textAlign: "center" }}>7</td>
                        <td style={{ width: "10%", textAlign: "center" }}>8</td>
                        <td style={{ width: "10%", textAlign: "center" }}>9</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </AccordionItem>
            </Accordion>
          </FlatCard>

          <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Upload the Committee marks With Signature (Candidate/
                    Committee Head)
                  </ModalHeader>
                  <ModalBody>
                    <CustomMultipleUpload
                      {...register("file")}
                      preview={upload}
                      setPreview={setUpload}
                      handleChange={handleChangeST}
                      setValue={setValue}
                      accept={".pdf"}
                      name="Attachments"
                      placeholder="Upload PDF"
                      type="single"
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="primary"
                      variant="solid"
                      className="w-full"
                      onPress={upload20Marks}
                      startContent={
                        <span
                          className="material-symbols-rounded"
                          style={{ color: "white" }}
                        >
                          upload
                        </span>
                      }
                    >
                      Upload File
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
};

export default DocumentVerificationMarks;
