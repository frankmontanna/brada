const loadingPule = "/loagind_pulse.gif";

export function LoadingqrModal() {
  return (
    <div className="w-full  flex text-center h-[500px] items-center justify-center">
      <div className="flex items-center flex-col justify-center">
        <img src={loadingPule} alt="" />
        <p className="text-2xl mt-5 leading-[100%] text-[#4d4e53] ">
          Por favor,
          <br /> aguarde...
        </p>
      </div>
    </div>
  );
}
