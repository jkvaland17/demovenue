export const ToggleHeading = (
  data: any,
  idsToToggle: string[],
  title: string,
) => {
  const updatedAccordionItem = data?.accordionItem?.map((item: any) => {
    if (idsToToggle.includes(item?.id)) {
      return { ...item, title };
    }
    return item;
  });

  return { ...data, accordionItem: updatedAccordionItem };
};
