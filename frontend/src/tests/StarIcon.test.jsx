import { render } from '@testing-library/react';
import StarIcon from '../components/StarIcon';

describe('StarIcon', () => {
  it('renders an svg element', () => {
    const { container } = render(<StarIcon filled={false} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies filled (gold) classes when filled is true', () => {
    const { container } = render(<StarIcon filled={true} />);
    const svg = container.querySelector('svg');
    expect(svg.getAttribute('class')).toContain('fill-amber-400');
  });

  it('applies outline classes when filled is false', () => {
    const { container } = render(<StarIcon filled={false} />);
    const svg = container.querySelector('svg');
    expect(svg.getAttribute('class')).toContain('fill-none');
  });

  it('merges in any additional className passed as a prop', () => {
    const { container } = render(<StarIcon filled className="w-10 h-10" />);
    const svg = container.querySelector('svg');
    expect(svg.getAttribute('class')).toContain('w-10 h-10');
  });
});
