import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CustomTooltip = ({ content, children, type }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const showTooltip = () => {
    setIsTooltipVisible(true);
  };

  const hideTooltip = () => {
    setIsTooltipVisible(false);
  };

  const showTooltipReload = () => {
    setTimeout(() => {
      setIsTooltipVisible(true);
    }, 2000);

    setTimeout(() => {
      setIsTooltipVisible(false);
    }, 4000);
  };

  return (
    <>

      {type === 'table' &&
        <div className="custom-tooltip-container" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
          {children}
          {isTooltipVisible && <div className="custom-tooltip">{content}</div>}
          {/* {true && <div className="custom-tooltip">{content}</div>} */}
        </div>
      }
      {type === 'reload' &&
        <div className="custom-tooltip-container" onMouseEnter={showTooltipReload} onMouseLeave={hideTooltip}>
          {children}
          {isTooltipVisible && <div className="custom-tooltip-two">{content}</div>}
        </div>
      }
      {type === 'reset' &&
        <div className="custom-tooltip-container-demo" onMouseEnter={showTooltipReload} onMouseLeave={hideTooltip}>
          {children}
          {isTooltipVisible && <div className="custom-tooltip-three">{content}</div>}
          {/* {true && <div className="custom-tooltip-three">{content}</div>} */}
        </div>

      }

    </>

  );
};

CustomTooltip.propTypes = {
  content: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default CustomTooltip;
