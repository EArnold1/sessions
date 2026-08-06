type Props = {
  item: React.ReactNode;
};

export const Pill = ({ item }: Props) => (
  <div className="text-sm rounded-full px-3 py-2 bg-black text-white w-fit">
    <span>{item}</span>
  </div>
);
