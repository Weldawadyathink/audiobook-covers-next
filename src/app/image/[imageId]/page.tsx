export default async function Page({
  params,
}: {
  params: { imageId: string };
}) {
  return (
    <>
      <span>{params.imageId}</span>
      <p>Hello world</p>
    </>
  );
}
