export function getFormDataValue(
  multipartFormData: any[],
  name: string,
  image: boolean = false
) {
  const data = multipartFormData.find((data) => data.name === name)?.data;
  if (image) {
    return data;
  }
  if (data) {
    return new TextDecoder().decode(data);
  }
  return null;
}
