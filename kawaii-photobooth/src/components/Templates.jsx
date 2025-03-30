import { useNavigate } from 'react-router-dom';

export default function Templates() {
  const navigate = useNavigate();

  const handleSelectFirstTemplate = () => {
    navigate('/photo');
  };
  const handleSelextSecondTemplate = () => {
    navigate('/photo2');
  }
  const handleSelectThirdTemplate = () => {
    navigate('/photo3');
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
      {/* Template 1 */}
      <div className="flex flex-col items-center">
        <div className="bg-white w-[200px] h-[505px] flex flex-col items-center justify-between shadow-lg">
          <div className="grid grid-cols-1 gap-2 p-2">
            <div className="bg-gray-300 w-[180px] h-[110px]" />
            <div className="bg-gray-300 w-[180px] h-[110px]" />
            <div className="bg-gray-300 w-[180px] h-[110px]" />
          </div>
          <p className="text-[8px] font-kiwi text-black mb-2">@kawaiiphotobooth</p>
        </div>
        <button
          onClick={handleSelectFirstTemplate}
          className="mt-4 bg-rose hover:bg-mauve font-koh font-bold text-white text-sm px-4 py-1 rounded-md"
        >
          Select
        </button>
      </div>

      {/* Template 2 */}
      <div className="flex flex-col items-center">
        <div className="bg-white w-[200px] h-[505px] flex flex-col items-center justify-between shadow-lg">
          <div className="grid grid-cols-1 gap-2 p-2">
            <div className="bg-gray-300 w-[180px] h-[110px]" />
            <div className="bg-gray-300 w-[180px] h-[110px]" />
            <div className="bg-gray-300 w-[180px] h-[110px]" />
            <div className="bg-gray-300 w-[180px] h-[110px]" />
          </div>
          <p className="text-[8px] font-kiwi text-black mb-2">@kawaiiphotobooth</p>
        </div>
        <button 
          onClick={handleSelextSecondTemplate}
          className="mt-4 bg-rose hover:bg-mauve font-koh font-bold text-white text-sm px-4 py-1 rounded-md"
        >
          Select
        </button>
      </div>

      {/* Template 3 */}
      <div className="flex flex-col items-center">
        <div className="bg-white w-[400px] h-[505px] flex flex-col items-center justify-between shadow-lg">
          <div className="grid grid-cols-2 gap-2 p-2">
            <div className="bg-gray-300 w-[180px] h-[110px]" />
            <div className="bg-gray-300 w-[180px] h-[110px]" />
            <div className="bg-gray-300 w-[180px] h-[110px]" />
            <div className="bg-gray-300 w-[180px] h-[110px]" />
            <div className="bg-gray-300 w-[180px] h-[110px]" />
            <div className="bg-gray-300 w-[180px] h-[110px]" />
            <div className="bg-gray-300 w-[180px] h-[110px]" />
            <div className="bg-gray-300 w-[180px] h-[110px]" />
          </div>
          <p className="text-[8px] font-kiwi text-black mb-2">@kawaiiphotobooth</p>
        </div>
        <button 
          className="mt-4 bg-rose hover:bg-mauve font-koh font-bold text-white text-sm px-4 py-1 rounded-md"
          onClick={handleSelectThirdTemplate}
        >
          Select
        </button>
      </div>
    </div>
  );
}