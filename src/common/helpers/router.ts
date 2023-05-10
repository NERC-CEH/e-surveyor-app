import { isPlatform } from '@ionic/core';
import { useIonRouter, iosTransitionAnimation } from '@ionic/react';

export default () => {
  const router = useIonRouter();

  return {
    replace: (url: string) => {
      const iosAnimation = (navEl: any, opts: any) => {
        opts.leavingEl.style['z-index'] = 0; // eslint-disable-line

        return iosTransitionAnimation(navEl, {
          ...opts,
          direction: 'forward',
        });
      };

      // const mdAnimation = (navEl: any, opts: any) => {
      //   const OFF_BOTTOM = '40px';
      //   const CENTER = '0px';

      //   const animation = createAnimation();
      //   const ionPageElement = getIonPageElement(opts.enteringEl);
      //   animation
      //     .addElement(ionPageElement)
      //     .fill('both')
      //     .beforeRemoveClass('ion-page-invisible');

      //   return animation
      //     .duration(280)
      //     .easing('cubic-bezier(0.36,0.66,0.04,1)')
      //     .fromTo(
      //       'transform',
      //       `translateY(${OFF_BOTTOM})`,
      //       `translateY(${CENTER})`
      //     )
      //     .fromTo('opacity', 0.01, 1);

      //   // return mdTransitionAnimation(navEl, {
      //   //   ...opts,
      //   //   direction: 'forward',
      //   // });
      // };

      const animation = isPlatform('ios') ? iosAnimation : undefined;

      router.push(url, 'forward', 'replace', undefined, animation);
    },
  };
};
