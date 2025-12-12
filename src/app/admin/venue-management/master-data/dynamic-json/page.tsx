"use client";
import {
  CallGetAllFormTemplates,
  CallGetFormByTemplateId,
  CallUpdateFormByTemplateId,
} from "@/_ServerActions";
import { useAdvertisement } from "@/components/AdvertisementContext";
import FieldCard from "@/components/FieldCard";
import FlatCard from "@/components/FlatCard";
import { handleCommonErrors } from "@/Utils/HandleError";
import { Accordion, AccordionItem, Button, Spinner } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

const DynamicJson = (props: Props) => {
  const { currentAdvertisementID } = useAdvertisement();
  const [options, setOptions] = useState<any>([]);
  const [currentTemplate, setCurrentTemplate] = useState<any>(null);
  const [currentTemplateForm, setCurrentTemplateForm] = useState<any>([]);
  const [isOptionLoading, setIsOptionLoading] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
  const [invalidFieldIds, setInvalidFieldIds] = useState<Set<string>>(
    new Set(),
  );

  const getTemplateList = async () => {
    setIsOptionLoading(true);
    try {
      const { data, error } = (await CallGetAllFormTemplates()) as any;
      console.log("getTemplateList", { data, error });

      if (data) {
        setOptions(data?.data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsOptionLoading(false);
  };
  useEffect(() => {
    if (currentAdvertisementID) getTemplateList();
  }, [currentAdvertisementID]);

  const getFormByTemplateId = async (templateId: string) => {
    setIsFormLoading(true);
    try {
      const query = `key=${templateId}&advertisementId=${currentAdvertisementID}`;
      const { data, error } = (await CallGetFormByTemplateId(query)) as any;
      console.log("getFormByTemplateId", { data, error });

      if (data) {
        setCurrentTemplate(data?.data);
        setCurrentTemplateForm(data?.data?.formData);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsFormLoading(false);
  };

  const validateFormTemplate = (form: any[]): Set<string> => {
    const invalidSet = new Set<string>();

    const checkField = (field: any, id: string) => {
      if (!field.key || !field.title || !field.type) {
        invalidSet.add(id);
        return;
      }

      if (["option", "radio", "multiple_option"].includes(field.type)) {
        if (!Array.isArray(field.options)) {
          invalidSet.add(id);
          return;
        }
        field.options.forEach((opt: any, i: number) => {
          if (!opt.key || !opt.title) {
            invalidSet.add(id); // Option errors are attributed to parent field
          }
        });
      }
    };

    form.forEach((sectionOrPhase: any, sIdx: number) => {
      if (sectionOrPhase?.sections) {
        sectionOrPhase.sections.forEach((section: any, secIdx: number) => {
          section.fields.forEach((field: any, fIdx: number) => {
            checkField(field, `${sIdx}-${secIdx}-${fIdx}`);
          });
        });
      } else if (sectionOrPhase?.fields) {
        sectionOrPhase.fields.forEach((field: any, fIdx: number) => {
          checkField(field, `${sIdx}-${fIdx}`);
        });
      } else {
        checkField(sectionOrPhase, `${sIdx}`);
      }
    });

    return invalidSet;
  };

  const updateForm = async () => {
    try {
      const invalids = validateFormTemplate(currentTemplateForm);
      setInvalidFieldIds(invalids); // highlight invalids
      if (invalids.size > 0) {
        toast.error("Can not submit form template with empty fields");
        return;
      }

      const submitData = {
        ...currentTemplate,
        formData: currentTemplateForm,
      };
      console.log("submitData", submitData);

      const { data, error } = (await CallUpdateFormByTemplateId(
        submitData,
      )) as any;
      console.log("updateForm", { data, error });

      if (data?.message) {
        toast.success(data?.message);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log("currentTemplateForm", currentTemplateForm);

  return (
    <>
      <FlatCard>
        <div className="mb-2 flex justify-between gap-8">
          <h2 className="mb-4 text-xl font-semibold">Dynamic Form</h2>
          {/* <Button
            color="primary"
            variant="shadow"
            startContent={
              <span className="material-symbols-rounded">post_add</span>
            }
          >
            Add New Form
          </Button> */}
        </div>

        <Select
          items={options}
          label="Select Form Template"
          labelPlacement="outside"
          placeholder="Select"
          isLoading={isOptionLoading}
          isRequired
          onChange={(e: any) => {
            getFormByTemplateId(e.target.value);
          }}
        >
          {(item: any) => (
            <SelectItem key={item?.key}>{item?.title}</SelectItem>
          )}
        </Select>
      </FlatCard>

      {isFormLoading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          {currentTemplate && (
            <FlatCard>
              <div className="mb-6 flex justify-between gap-6 mob:flex-col mob:gap-2    ">
                <h2 className="mb-4 text-xl font-semibold">
                  {currentTemplate?.title}
                </h2>

                <div className="flex gap-3 ">
                  {isEditMode && (
                    <Button
                      color="secondary"
                      startContent={
                        <span className="material-symbols-rounded">add</span>
                      }
                      onPress={() => {
                        const newField = {
                          key: "",
                          title: "",
                          type: "",
                          mandatory: false,
                        };
                        setCurrentTemplateForm([
                          ...currentTemplateForm,
                          newField,
                        ]);
                      }}
                    >
                      Add Field
                    </Button>
                  )}

                  <Button
                    color="primary"
                    onPress={() => {
                      if (isEditMode) {
                        updateForm();
                      }
                      setIsEditMode(!isEditMode);
                    }}
                  >
                    {isEditMode ? "Validate and Submit" : "Edit"}
                  </Button>
                </div>
              </div>

              {Array.isArray(currentTemplateForm) &&
              currentTemplateForm[0]?.sections ? (
                // phase-based structure
                <>
                  {currentTemplateForm.map((phase: any, pIndex: number) => (
                    <div key={pIndex} className="mb-8">
                      {phase?.titleEnglish && (
                        <h2 className="mb-4 text-xl font-bold">
                          {phase.titleEnglish}
                        </h2>
                      )}

                      <Accordion isCompact>
                        {phase.sections?.map((section: any, sIndex: number) => (
                          <AccordionItem
                            key={sIndex}
                            title={
                              <p className="text-lg font-medium">
                                {section.titleEnglish}
                              </p>
                            }
                          >
                            <div className="grid grid-cols-3 gap-6 mob:grid-cols-1">
                              {section.fields?.map(
                                (field: any, fIndex: number) => (
                                  <FieldCard
                                    key={fIndex}
                                    index={fIndex}
                                    data={field}
                                    isEditMode={isEditMode}
                                    hasError={invalidFieldIds.has(
                                      `${pIndex}-${sIndex}-${fIndex}`,
                                    )}
                                    onChange={(idx, updatedField) => {
                                      const updated = [...currentTemplateForm];
                                      const fields = [
                                        ...updated[pIndex].sections[sIndex]
                                          .fields,
                                      ];
                                      fields[idx] = {
                                        ...fields[idx],
                                        ...updatedField,
                                      };
                                      updated[pIndex].sections[sIndex].fields =
                                        fields;
                                      setCurrentTemplateForm(updated);
                                    }}
                                    onRemove={(idx) => {
                                      const updated = [...currentTemplateForm];
                                      const fields = [
                                        ...updated[pIndex].sections[sIndex]
                                          .fields,
                                      ];
                                      fields.splice(idx, 1);
                                      updated[pIndex].sections[sIndex].fields =
                                        fields;
                                      setCurrentTemplateForm(updated);
                                    }}
                                  />
                                ),
                              )}
                            </div>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))}
                </>
              ) : currentTemplateForm[0]?.fields ? (
                // section-based structure
                <Accordion isCompact>
                  {currentTemplateForm.map((section: any, sIndex: number) => (
                    <AccordionItem
                      key={sIndex}
                      title={
                        <p className="text-lg font-medium">
                          {section.titleEnglish}
                        </p>
                      }
                    >
                      <div className="grid grid-cols-3 gap-6 mob:grid-cols-1">
                        {section.fields?.map((field: any, fIndex: number) => (
                          <FieldCard
                            key={fIndex}
                            index={fIndex}
                            data={field}
                            isEditMode={isEditMode}
                            hasError={invalidFieldIds.has(
                              `${sIndex}-${fIndex}`,
                            )}
                            onChange={(idx, updatedField) => {
                              const updated = [...currentTemplateForm];
                              const fields = [...updated[sIndex].fields];
                              fields[idx] = { ...fields[idx], ...updatedField };
                              updated[sIndex].fields = fields;
                              setCurrentTemplateForm(updated);
                            }}
                            onRemove={(idx) => {
                              const updated = [...currentTemplateForm];
                              const fields = [...updated[sIndex].fields];
                              fields.splice(idx, 1);
                              updated[sIndex].fields = fields;
                              setCurrentTemplateForm(updated);
                            }}
                          />
                        ))}
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                // Direct field-only structure
                <div className="grid grid-cols-3 gap-6 mob:grid-cols-1">
                  {currentTemplateForm.map((field: any, index: number) => (
                    <FieldCard
                      key={index}
                      index={index}
                      data={field}
                      isEditMode={isEditMode}
                      hasError={invalidFieldIds.has(`${index}`)}
                      onChange={(idx, updatedField) => {
                        const updated = [...currentTemplateForm];
                        updated[idx] = { ...updated[idx], ...updatedField };
                        setCurrentTemplateForm(updated);
                      }}
                      onRemove={(idx) => {
                        const updated = [...currentTemplateForm];
                        updated.splice(idx, 1);
                        setCurrentTemplateForm(updated);
                      }}
                    />
                  ))}
                </div>
              )}
            </FlatCard>
          )}
        </>
      )}
    </>
  );
};      
export default DynamicJson;
