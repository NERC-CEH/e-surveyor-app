import type { Logo } from './content';

const LogoGrid = ({ logos }: { logos: Logo[] }) => (
  <div className="grid grid-cols-4 p-3">
    {logos.map(({ name, src, url }) => (
      <a
        key={name}
        href={url}
        title={name}
        className="col-span-2 flex min-h-20 items-center justify-center rounded-lg bg-white p-4 last:odd:col-start-2"
      >
        <img
          src={src}
          alt={name}
          className="h-16 w-full object-contain object-center"
        />
      </a>
    ))}
  </div>
);

export default LogoGrid;
