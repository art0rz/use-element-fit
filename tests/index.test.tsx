import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { ScaleMode, useElementFit } from '../src';
import delay from 'delay';

const Observed = ({
  id,
  width,
  height,
  scaleMode,
  alignmentX,
  alignmentY,
  maxWidth,
  maxHeight,
}: {
  id: string;
  width: number;
  height: number;
  scaleMode?: ScaleMode;
  alignmentX: number;
  alignmentY: number;
  maxWidth?: number;
  maxHeight?: number;
}) => {
  const { ref, width: fitWidth, height: fitHeight } = useElementFit(
    width,
    height,
    scaleMode,
    alignmentX,
    alignmentY,
    maxWidth,
    maxHeight,
  );
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      id={id}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0px',
        left: '0px',
      }}
    >
      <div id={`${id}_size`}>
        {fitWidth}x{fitHeight}
      </div>
      <div id={`${id}_alignment`}>
        {alignmentY}x{alignmentY}
      </div>
    </div>
  );
};

const createApp = (
  width: number,
  height: number,
  scaleMode: ScaleMode = ScaleMode.CONTAIN,
  alignmentX: number = 0.5,
  alignmentY: number = 0.5,
  maxWidth?: number | undefined,
  maxHeight?: number | undefined,
): {
  container: HTMLDivElement;
  size: HTMLElement;
  alignment: HTMLElement;
  destroy: () => void;
} => {
  const id = `el_${Math.floor(Math.random() * 1000000).toString(32)}`;

  const app = document.createElement('div');
  app.style.position = 'absolute';
  app.style.width = '100px';
  app.style.height = '100px';
  app.style.top = '0px';
  app.style.left = '0px';
  app.style.background = '#dadada';

  document.body.appendChild(app);

  render(
    <Observed
      id={id}
      {...{
        width,
        height,
        scaleMode,
        alignmentX,
        alignmentY,
        maxWidth,
        maxHeight,
      }}
    />,
    app,
  );

  const size = document.getElementById(`${id}_size`);
  const alignment = document.getElementById(`${id}_alignment`);

  if (size === null || alignment === null) {
    throw 'Could not render app';
  }

  return {
    size,
    alignment,
    container: app,
    destroy: () => {
      unmountComponentAtNode(app);
      document.body.removeChild(app);
    },
  };
};

describe('useElementFit', () => {
  describe('ScaleMode.CONTAIN', () => {
    const scaleX = 10;
    const scaleY = 5;
    const scaleMode = ScaleMode.CONTAIN;
    it('should initially report a size of 1x1', () => {
      const { size, destroy } = createApp(scaleX, scaleY, scaleMode);
      chai.expect(size.textContent).to.equal('1x1');
      destroy();
    });
    it('should report a correct size after ResizeObserver has been triggered', async () => {
      const { size, destroy } = createApp(scaleX, scaleY, scaleMode);

      await delay(100);
      chai.expect(size.textContent).to.equal('100x50');
      destroy();
    });
    it('should report a correct size after the container size has been changed', async () => {
      const { container, size, destroy } = createApp(scaleX, scaleY, scaleMode);

      container.style.width = '200px';
      container.style.height = '200px';
      await delay(100);
      chai.expect(size.textContent).to.equal('200x100');
      destroy();
    });
    it('should report a correct capped size when maxWidth and maxHeight are smaller than the container', async () => {
      const { size, destroy } = createApp(scaleX, scaleY, scaleMode, 0.5, 0.5, 10, 10);

      await delay(100);
      chai.expect(size.textContent).to.equal('10x5');
      destroy();
    });
    it('should report a correct capped size when maxWidth and maxHeight are larger than the container', async () => {
      const { size, destroy } = createApp(scaleX, scaleY, scaleMode, 0.5, 0.5, 200, 200);

      await delay(100);
      chai.expect(size.textContent).to.equal('100x50');
      destroy();
    });
  });

  describe('ScaleMode.COVER', () => {
    const scaleX = 10;
    const scaleY = 5;
    const scaleMode = ScaleMode.COVER;
    it('should initially report a size of 1x1', () => {
      const { size, destroy } = createApp(scaleX, scaleY, scaleMode);
      chai.expect(size.textContent).to.equal('1x1');
      destroy();
    });
    it('should report a correct size after ResizeObserver has been triggered', async () => {
      const { size, destroy } = createApp(scaleX, scaleY, scaleMode);

      await delay(100);
      chai.expect(size.textContent).to.equal('200x100');
      destroy();
    });
    it('should report a correct size after the container size has been changed', async () => {
      const { container, size, destroy } = createApp(scaleX, scaleY, scaleMode);

      container.style.width = '200px';
      container.style.height = '200px';
      await delay(100);
      chai.expect(size.textContent).to.equal('400x200');
      destroy();
    });
    it('should report a correct capped size when maxWidth and maxHeight are smaller than the container', async () => {
      const { size, destroy } = createApp(scaleX, scaleY, scaleMode, 0.5, 0.5, 10, 10);

      await delay(100);
      chai.expect(size.textContent).to.equal('10x5');
      destroy();
    });
    it('should report a correct capped size when maxWidth and maxHeight are larger than the container', async () => {
      const { size, destroy } = createApp(scaleX, scaleY, scaleMode, 0.5, 0.5, 200, 200);

      await delay(100);
      chai.expect(size.textContent).to.equal('200x100');
      destroy();
    });
  });

  describe('ScaleMode.COVER', () => {
    const scaleX = 10;
    const scaleY = 5;
    const scaleMode = ScaleMode.ALIGN_ONLY;
    it('should initially report a size of 1x1', () => {
      const { alignment, destroy } = createApp(scaleX, scaleY, scaleMode, 1, 1);
      chai.expect(alignment.textContent).to.equal('1x1');
      destroy();
    });
  });
});
