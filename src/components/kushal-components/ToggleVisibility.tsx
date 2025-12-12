export const ToggleVisibility = (
  data: any,
  idsToToggle: string[],
  ishidden: boolean,
) => {
  const updatedAccordionItem = data?.accordionItem?.map((item: any) => {
    const updatedFields = item.fields?.map((field: any) => {
      if (idsToToggle.includes(field.id)) {
        return { ...field, ishidden: ishidden };
      }
      return field;
    });
    return { ...item, fields: updatedFields };
  });

  return { ...data, accordionItem: updatedAccordionItem };
};
