- [Main-Frontend-Project](#main-frontend-project)
  - [Frontend Project Setup Instructions (Nuxt.js)](#frontend-project-setup-instructions-nuxtjs)
  - [Development](#development)
    - [Format Guidance](#format-guidance)
      - [The codes sequence in setup mode.](#the-codes-sequence-in-setup-mode)

# Main-Frontend-Project

## Frontend Project Setup Instructions (Nuxt.js)

**Current Setup Information:**
- Dependency Manager: Yarn (pnpm not yet tested)
- Node Version: 18+
- Yarn Version: Tested with 1.22.17, use the latest

**Steps to Set Up the Frontend Project:**

1. **Clone the Repository:**
   - Use Git to clone the project:
     ```bash
     git clone https://github.com/Aladia-Frontend/Main-Frontend-Project.git
     ```

2. **Clean Existing Dependencies:**
   - Delete the `node_modules` directory.
   - Delete all `*.lock` files.

3. **Install Dependencies:**
   - Run the command:
     ```bash
     yarn
     ```

4. **Start the Development Server:**
   - Use either command:
     ```bash
     npm run dev
     ```
     or
     ```bash
     yarn dev
     ```

5. **Check Node and Yarn Versions:**
   - Ensure your environment matches the required versions:
     ```bash
     node -v  # Should output version 18+
     yarn -v  # Should output version 1+
     ```


## Development
### Format Guidance
#### The codes sequence in setup mode.
```js
<script setup>
// 1. Props and Emits...
const props = defineProps({...})
const emit = defineEmits(['...'])

// 2. composable API import
import { xxx } from '@/composable/xxx'

// 3. other import
import { xxx } from '@/utils/xxx'

// 4. define states (ref, reactive)
const count = ref(0)
const state = reactive({...})

// 5. Store and other Hooks import
const store = useStore()

// 6. computed
const computedValue = computed(() => {})

// 7. life cycle
onMounted(() => {})
onUnmounted(() => {})

// 8. watch/watchEffect
watch(count, (newVal, oldVal) => {})
watchEffect(() => {})

// 9. functions
const handleClick = () => {}
const initData = () => {}

// 10. return (only required in setup function)
</script>

```