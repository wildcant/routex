<script>
  // Your selected Skeleton theme:
  import '@skeletonlabs/skeleton/themes/theme-rocket.css';

  // This contains the bulk of Skeletons required styles:
  import '@skeletonlabs/skeleton/styles/all.css';

  // Finally, your application's global stylesheet (sometimes labeled 'app.css')
  import '../app.postcss';

  import { storePopup } from '@skeletonlabs/skeleton';
  import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<slot />
