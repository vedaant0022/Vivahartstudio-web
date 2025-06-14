import styled from "styled-components";

const BrandSliderStyleWrapper = styled.section`
  padding: 80px 0 0 0;
  
  .container {
  }

  .brands-section-title {
    margin-bottom: 25px;
    text-align: center;
    h2 {
      font-size: 18px;
      font-weight: 800;
      line-height: 30px;
    }
  }

  .brands-slider {
    position: relative;
    width: 100%;
    height: 50px;
    overflow: hidden;

    &-container {
      width: calc(200px * 12);
      display: flex;
      align-items: center;
      gap: 0px;
      animation: smoothSlider 25s infinite linear;
    }

    .slider-item {
      width: 200px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        max-width: 160px;
        height: auto;
      }
    }

    &::before {
      position: absolute;
      z-index: 1;
      content: "";
      top: 0;
      left: 0;
      width: 120px;
      height: 100%;
      background: linear-gradient(
        270deg,
        #ffffff 0%,
        rgba(255, 255, 255, 0) 100%
      );
      transform: rotate(-180deg);
    }

    &::after {
      position: absolute;
      z-index: 1;
      content: "";
      top: 0;
      right: 0;
      width: 120px;
      height: 100%;
      background: linear-gradient(
        270deg,
        #ffffff 0%,
        rgba(255, 255, 255, 0) 100%
      );
    }
  }

  @keyframes smoothSlider {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-200px * 6));
    }
  }

  @media screen and (max-width: 767px) {
    padding-top: 70px;
    .brands-slider-container {
      gap: 50px;
    }
    .slider-item {
      width: 95px;
      height: 18px;
    }
  }
`;

export default BrandSliderStyleWrapper; 