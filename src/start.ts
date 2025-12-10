import { server } from './server';
import { port } from './config';

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
